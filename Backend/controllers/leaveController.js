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

   // Validation
    await validateLeaveRequest(req.body);


    // Create leave request
    const leaveRequest = new LeaveRequest({
      ...req.body,
      requestedBy: req.user?.userid // Get user ID from token
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

// Delete Leave Request
export const deleteLeaveRequest = async (req, res) => {
  try {
    // Authentication
    validateUserIdFromToken(req.user?.userid);

    const { id } = req.params;

    // Find and validate leave request
    const leaveRequest = await checkLeaveRequestExists(id, LeaveRequest);

    // Authorization check
    if (
      !isRequester(leaveRequest.requestedBy, req.user?.userid)
    ) {
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
