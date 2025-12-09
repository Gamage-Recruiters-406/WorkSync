import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

// Create Leave Request
export const createLeaveRequest = async (req, res) => {
  try {
    // Authentication and validation
    validateUserIdFromToken(req.userId);
    await checkUserExists(req.userId, User);

    // Create leave request
    const leaveRequest = new LeaveRequest({
      ...req.body,
      requestedBy: req.userId, // Set from token
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
    validateUserIdFromToken(req.userId);

    const { id } = req.params;

    // Find and validate leave request
    const leaveRequest = await checkLeaveRequestExists(id, LeaveRequest);

    // Authorization check
    if (
      !isRequesterOrAdmin(leaveRequest.requestedBy, req.userId, req.userRole)
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




// Helper Functions

// Authentication and authorization helpers
export const validateUserIdFromToken = (userId) => {
  if (!userId) {
    throw {
      status: 401,
      message: "Authentication required. User ID not found in token."
    };
  }
};

export const checkUserExists = async (userId, User) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw {
      status: 404,
      message: "User not found."
    };
  }
  return userExists;
};

// Leave request validation helpers
export const checkLeaveRequestExists = async (leaveRequestId, LeaveRequest) => {
  const leaveRequest = await LeaveRequest.findById(leaveRequestId);
  if (!leaveRequest) {
    throw {
      status: 404,
      message: "Leave request not found."
    };
  }
  return leaveRequest;
};

// Authorization check functions
export const isRequester = (leaveRequestUserId, currentUserId) => {
  return leaveRequestUserId.toString() === currentUserId.toString();
};

export const isAdmin = (userRole) => {
  return userRole === "admin";
};

export const isRequesterOrAdmin = (leaveRequestUserId, currentUserId, userRole) => {
  return isRequester(leaveRequestUserId, currentUserId) || isAdmin(userRole);
};

// Leave request status validation
export const canDeleteLeaveRequest = (status) => {
  const allowedStatuses = ["pending", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw {
      status: 400,
      message: "Cannot delete leave request that has been approved or rejected."
    };
  }
  return true;
};

// Population helper
export const populateLeaveRequestDetails = async (leaveRequestId, LeaveRequest) => {
  return await LeaveRequest.findById(leaveRequestId)
    .populate("requestedBy", "username fullName email department")
    .populate("approvedBy", "username fullName email");
};

// Error handler
export const handleControllerError = (error, res) => {
  console.error("Controller error:", error);
  
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }
  
  // Use custom thrown errors or generic
  const status = error.status || 500;
  const message = error.message || "Internal server error.";
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};