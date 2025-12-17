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

    res.json({
      success: true,
      message: `Leave request ${sts} successfully.`,
      data: populatedLeave,
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
