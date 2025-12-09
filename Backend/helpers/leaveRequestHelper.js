// leaveRequestHelper.js

import LeaveRequest from "../models/LeaveRequest.js";
//import User from "../models/User.js";

// Authentication and authorization helpers
export const validateUserIdFromToken = (userId) => {
  if (!userId) {
    throw {
      status: 401,
      message: "Authentication required. User ID not found in token.",
    };
  }
};

export const checkUserExists = async (userId) => {
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }
  return userExists;
};

// Leave request validation helpers
export const checkLeaveRequestExists = async (leaveRequestId) => {
  const leaveRequest = await LeaveRequest.findById(leaveRequestId);
  if (!leaveRequest) {
    throw {
      status: 404,
      message: "Leave request not found.",
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

export const isRequesterOrAdmin = (
  leaveRequestUserId,
  currentUserId,
  userRole
) => {
  return isRequester(leaveRequestUserId, currentUserId) || isAdmin(userRole);
};

// Leave request status validation
export const canDeleteLeaveRequest = (status) => {
  const allowedStatuses = ["pending", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw {
      status: 400,
      message:
        "Cannot delete leave request that has been approved or rejected.",
    };
  }
  return true;
};

// Population helper
export const populateLeaveRequestDetails = async (leaveRequestId) => {
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
    errors: error.errors || undefined,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};


// Validation helper for leave request
export const validateLeaveRequest = (leaveData) => {
  const { leaveType, reason, startDate, endDate } = leaveData;
  const errors = [];

  // Validate required fields
  if (!leaveType) errors.push("leaveType is required");
  
  if (!reason || reason.trim().length === 0) {
    errors.push("Reason is required");
  } else if (reason.length < 10) {
    errors.push("Reason must be at least 10 characters");
  }
  
  if (!startDate) errors.push("startDate is required");
  if (!endDate) errors.push("endDate is required");

  // Validate date logic if both dates exist
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if start date is in the past
    if (start < today) {
      errors.push("Start date cannot be in the past");
    }

    // Check if end date is after start date
    if (start >= end) {
      errors.push("End date must be after start date");
    }
  }

  // Return errors if any exist
  if (errors.length > 0) {
    throw {
      status: 400,
      message: "Leave request validation failed",
      errors,
    };
  }

  return true;
};