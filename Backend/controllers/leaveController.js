import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import {
  validateUserIdFromToken,
  checkUserExists,
  checkLeaveRequestExists,
  isRequester,
  canDeleteLeaveRequest,
  populateLeaveRequestDetails,
  handleControllerError,
  validateLeaveRequest
} from "../helpers/leaveRequestHelper.js";
import { sendLeaveStatusEmail } from "../helpers/emailHelper.js";

// LEAVE POLICY (YEARLY)
const LEAVE_POLICY = {
  sick: 10,
  annual: 10,
  casual: 5,
};

// Create Leave Request
export const createLeaveRequest = async (req, res) => {
  try {
    // Authentication and validation
    validateUserIdFromToken(req.user?.userid);
    await checkUserExists(req.user?.userid);

    // Validate request body
    await validateLeaveRequest(req.body);

    // Create leave request
    const leaveRequest = new LeaveRequest({
      ...req.body,
      requestedBy: req.user?.userid
    });

    await leaveRequest.save();

    // Populate and return
    const populatedLeave = await populateLeaveRequestDetails(
      leaveRequest._id,
      LeaveRequest
    );

    res.status(201).json({
      success: true,
      message: "Leave request created successfully.",
      data: populatedLeave,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Update Leave Request (PUT) - Requester only
export const updateLeaveRequest = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);

    const { id } = req.params;

    // Find leave request
    const leaveRequest = await checkLeaveRequestExists(id, LeaveRequest);

    // Only requester can update
    if (!isRequester(leaveRequest.requestedBy, req.user?.userid)) {
      throw {
        status: 403,
        message: "You don't have permission to update this leave request.",
      };
    }

    // Only pending leaves can be updated
    if (leaveRequest.sts !== "pending") {
      throw {
        status: 400,
        message: "Only pending leave requests can be updated.",
      };
    }

    // Validate body
    await validateLeaveRequest(req.body);

    // Only allow specific fields to be updated
    const allowedUpdates = ["leaveType", "reason", "startDate", "endDate"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update leave request
    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    const populatedLeave = await populateLeaveRequestDetails(
      updatedLeave._id,
      LeaveRequest
    );

    res.json({
      success: true,
      message: "Leave request updated successfully.",
      data: populatedLeave,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Update Leave Status (PATCH) - Manager/Admin only
export const updateLeaveStatus = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);

    const { id } = req.params;
    const { sts } = req.body;

    // Validate status
    if (!["approved", "rejected", "pending"].includes(sts)) {
      throw {
        status: 400,
        message: "Invalid leave status.",
      };
    }

    // Find leave request
    const leaveRequest = await checkLeaveRequestExists(id, LeaveRequest);

    // Update status
    leaveRequest.sts = sts;
    leaveRequest.approvedBy =
      sts === "approved" || sts === "rejected"
        ? req.user?.userid
        : null;

    await leaveRequest.save();

    const populatedLeave = await populateLeaveRequestDetails(
      leaveRequest._id,
      LeaveRequest
    );

    // Send email notification
    if (populatedLeave.requestedBy && populatedLeave.requestedBy.email && (sts === "approved" || sts === "rejected")) {
      await sendLeaveStatusEmail(
        populatedLeave.requestedBy.email,
        populatedLeave.requestedBy.name,
        sts
      );
    }

    res.json({
      success: true,
      message: `Leave request ${sts} successfully.`,
      data: populatedLeave,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Get all leaves of a user
export const getLeavesByUser = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);
    const { uid } = req.params;

    // Check user exists
    await checkUserExists(uid);

    // If current user is not Admin/Manager, they can only view their own leaves
    if (![2, 3].includes(req.user.role) && req.user.userid !== uid) {
      throw {
        status: 403,
        message: "You can only view your own leave requests.",
      };
    }

    const leaves = await LeaveRequest.find({ requestedBy: uid })
      .sort({ createdAt: -1 })
      .populate("requestedBy", "username fullName email department")
      .populate("approvedBy", "username fullName email");

    res.json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Get single leave request
export const getSingleLeave = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);
    const { id } = req.params;

    // Find leave
    const leave = await checkLeaveRequestExists(id);

    // If current user is not Admin/Manager, they can only view their own leave
    if (![2, 3].includes(req.user.role) && !isRequester(leave.requestedBy, req.user.userid)) {
      throw {
        status: 403,
        message: "You are not allowed to view this leave request.",
      };
    }

    const populatedLeave = await populateLeaveRequestDetails(leave._id);

    res.json({
      success: true,
      data: populatedLeave,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Get all leave requests (Admin / Manager only)
export const getAllLeaves = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);

    // Only Admin (3) or Manager (2) can access all leaves
    if (![2, 3].includes(req.user.role)) {
      throw {
        status: 403,
        message: "Access denied. Only Admin or Manager can view all leave requests.",
      };
    }

    const leaves = await LeaveRequest.find()
      .sort({ createdAt: -1 })
      .populate("requestedBy", "username fullName email department")
      .populate("approvedBy", "username fullName email");

    res.json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

//get leave balance per year
export const getLeaveBalance = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);
    const userId = req.user.userid;

    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const yearEnd = new Date(new Date().getFullYear(), 11, 31);

    const leaves = await LeaveRequest.find({
      requestedBy: userId,
      createdAt: { $gte: yearStart, $lte: yearEnd },
    });

    const used = { sick: 0, annual: 0, casual: 0 };
    let approved = 0;
    let rejected = 0;
     let pending = 0;

    leaves.forEach(l => {
      if (l.sts === "approved") {
        approved++;
        if (used[l.leaveType] !== undefined) used[l.leaveType]++;
      } else if (l.sts === "rejected") {
        rejected++;
      } else if (l.sts === "pending") {
        pending++;
      }
    });

    res.json({
      success: true,
      balance: {
        sick: `${used.sick}/${LEAVE_POLICY.sick}`,
        annual: `${used.annual}/${LEAVE_POLICY.annual}`,
        casual: `${used.casual}/${LEAVE_POLICY.casual}`,
      },
      counts: {
        approved,
        rejected,
        pending,
      },
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};


// Delete Leave Request - Requester only
export const deleteLeaveRequest = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);

    const { id } = req.params;

    // Find and validate leave request
    const leaveRequest = await checkLeaveRequestExists(id, LeaveRequest);

    // Only requester can delete
    if (!isRequester(leaveRequest.requestedBy, req.user?.userid)) {
      throw {
        status: 403,
        message: "You don't have permission to delete this leave request.",
      };
    }

    // Status validation
    canDeleteLeaveRequest(leaveRequest.sts);

    // Delete the leave request
    await LeaveRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Leave request deleted successfully.",
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};
