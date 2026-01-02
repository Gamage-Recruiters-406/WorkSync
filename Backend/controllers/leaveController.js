import mongoose from "mongoose";
import LeaveRequest from "../models/LeaveRequest.js";
import {
  validateUserIdFromToken,
  checkUserExists,
  checkLeaveRequestExists,
  isRequester,
  canDeleteLeaveRequest,
  populateLeaveRequestDetails,
  handleControllerError,
  validateLeaveRequest,
  isAdminOrManager,
  canUpdateLeaveRequest,
  calculateWorkingDays,
  checkLeaveOverlap,
  hasLeavePermission
} from "../helpers/leaveRequestHelper.js";
import { sendLeaveStatusEmail } from "../helpers/emailHelper.js";

// LEAVE POLICY (YEARLY)
const LEAVE_POLICY = {
  sick: 10,
  annual: 10,
  casual: 5,
};

// Helper to calculate days between dates (including both start and end)
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Create Leave Request
export const createLeaveRequest = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);
    await checkUserExists(req.user.userid);

    validateLeaveRequest(req.body);

    // Check for overlapping leaves
    await checkLeaveOverlap(
      req.user.userid,
      req.body.startDate,
      req.body.endDate
    );

    const leaveRequest = new LeaveRequest({
      ...req.body,
      requestedBy: new mongoose.Types.ObjectId(req.user.userid)
    });

    await leaveRequest.save();
    const populatedLeave = await populateLeaveRequestDetails(leaveRequest._id);

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

    const leaveRequest = await checkLeaveRequestExists(id);

    // Use unified permission checker
    if (!hasLeavePermission(leaveRequest, req.user, 'update')) {
      throw {
        status: 403,
        message: "You don't have permission to update this leave request.",
      };
    }

    // Only allow specific fields to be updated
    const allowedUpdates = ["leaveType", "reason", "startDate", "endDate"];
    const updates = {};
    
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw {
        status: 400,
        message: "No valid fields provided for update.",
      };
    }

    // Create temporary object for validation
    const tempData = { ...leaveRequest.toObject(), ...updates };
    validateLeaveRequest(tempData);

    // Check for overlapping leaves (excluding current leave)
    if (updates.startDate || updates.endDate) {
      await checkLeaveOverlap(
        req.user.userid,
        updates.startDate || leaveRequest.startDate,
        updates.endDate || leaveRequest.endDate,
        id
      );
    }

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    const populatedLeave = await populateLeaveRequestDetails(updatedLeave._id);

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
    const { sts, rejectionReason } = req.body;

    if (!["approved", "rejected", "pending", "cancelled"].includes(sts)) {
      throw {
        status: 400,
        message: "Invalid leave status.",
      };
    }

    const leaveRequest = await checkLeaveRequestExists(id);

    // Determine permission based on status
    let hasPermission = false;
    if (["approved", "rejected"].includes(sts)) {
      hasPermission = hasLeavePermission(leaveRequest, req.user, 'approve');
    } else if (sts === "cancelled") {
      hasPermission = hasLeavePermission(leaveRequest, req.user, 'cancel');
    } else if (sts === "pending") {
      // Only requester can set back to pending
      hasPermission = isRequester(leaveRequest.requestedBy, req.user.userid);
    }

    if (!hasPermission) {
      throw {
        status: 403,
        message: "You don't have permission to perform this action.",
      };
    }

    // Prepare update data
    const updateData = {
      sts,
      approvedBy: ["approved", "rejected"].includes(sts)
        ? new mongoose.Types.ObjectId(req.user.userid)
        : null,
    };

    // Add rejection reason if provided
    if (sts === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    const populatedLeave = await populateLeaveRequestDetails(updatedLeave._id);

    // Send email notification
    if (
      populatedLeave.requestedBy &&
      populatedLeave.requestedBy.email &&
      ["approved", "rejected"].includes(sts)
    ) {
      const fullName = `${populatedLeave.requestedBy.FirstName} ${populatedLeave.requestedBy.LastName}`;
      await sendLeaveStatusEmail(
        populatedLeave.requestedBy.email,
        fullName,
        sts,
        rejectionReason
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

    await checkUserExists(uid);

    // Check if user is viewing their own leaves or is Admin/Manager
    const isOwnLeaves = req.user.userid === uid;
    if (!isOwnLeaves && !isAdminOrManager(req.user.role)) {
      throw {
        status: 403,
        message: "You can only view your own leave requests.",
      };
    }

    const leaves = await LeaveRequest.find({ requestedBy: uid })
      .sort({ createdAt: -1 })
      .populate({
        path: "requestedBy",
        select: "FirstName LastName email departmentID role",
        populate: { 
          path: "departmentID", 
          select: "name departmentCode location email" 
        }
      })
      .populate("approvedBy", "FirstName LastName email");

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

    const leave = await checkLeaveRequestExists(id);

    if (!hasLeavePermission(leave, req.user, 'view')) {
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

    if (!isAdminOrManager(req.user.role)) {
      throw {
        status: 403,
        message: "Access denied. Only Admin or Manager can view all leave requests.",
      };
    }

    const leaves = await LeaveRequest.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "requestedBy",
        select: "FirstName LastName email departmentID role",
        populate: { 
          path: "departmentID", 
          select: "name departmentCode location email" 
        }
      })
      .populate("approvedBy", "FirstName LastName email");

    res.json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};

// Get leave balance per year - FIXED VERSION
export const getLeaveBalance = async (req, res) => {
  try {
    validateUserIdFromToken(req.user?.userid);
    const userId = req.user.userid;

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // Get approved leaves that overlap with the current year
    const leaves = await LeaveRequest.find({
      requestedBy: userId,
      sts: "approved",
      $or: [
        { 
          startDate: { $lte: yearEnd },
          endDate: { $gte: yearStart }
        }
      ]
    });

    const used = { sick: 0, annual: 0, casual: 0 };

    leaves.forEach(leave => {
      // Calculate overlapping days with current year
      const overlapStart = leave.startDate < yearStart ? yearStart : leave.startDate;
      const overlapEnd = leave.endDate > yearEnd ? yearEnd : leave.endDate;
      
      if (overlapStart <= overlapEnd) {
        const days = calculateDays(overlapStart, overlapEnd);
        if (used[leave.leaveType] !== undefined) {
          used[leave.leaveType] += days;
        }
      }
    });

    res.json({
      success: true,
      year: currentYear,
      policy: LEAVE_POLICY,
      used,
      remaining: {
        sick: Math.max(0, LEAVE_POLICY.sick - used.sick),
        annual: Math.max(0, LEAVE_POLICY.annual - used.annual),
        casual: Math.max(0, LEAVE_POLICY.casual - used.casual)
      },
      usage: {
        sick: `${used.sick}/${LEAVE_POLICY.sick}`,
        annual: `${used.annual}/${LEAVE_POLICY.annual}`,
        casual: `${used.casual}/${LEAVE_POLICY.casual}`,
      }
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

    const leaveRequest = await checkLeaveRequestExists(id);

    if (!hasLeavePermission(leaveRequest, req.user, 'delete')) {
      throw {
        status: 403,
        message: "You don't have permission to delete this leave request.",
      };
    }

    canDeleteLeaveRequest(leaveRequest.sts);
    await LeaveRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Leave request deleted successfully.",
    });
  } catch (error) {
    handleControllerError(error, res);
  }
};
