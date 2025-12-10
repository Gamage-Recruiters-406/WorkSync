// Backend/__tests__/leaveController.test.js
import { describe, expect, test, beforeEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import LeaveRequest from "../models/LeaveRequest.js";
import app from "../app.js";

// Clear data before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (error) {
      // Ignore errors if collection doesn't exist
    }
  }
});

describe("Leave Controller APIs", () => {
  // Helper function to get future dates
  const getFutureDate = (daysFromNow = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  // Helper to create test user and get token
  const createTestUser = async () => {
    const timestamp = Date.now();
    const testUserData = {
      name: "Test Employee",
      role: 1,
      email: `test${timestamp}@example.com`,
      password: "password123",
    };

    // Register user
    const registerRes = await request(app)
      .post("/api/v1/userAuth/userRegistration")
      .send(testUserData);

    expect(registerRes.status).toBe(201);
    const userId = registerRes.body.data.userid;

    // Login to get token
    const loginRes = await request(app)
      .post("/api/v1/userAuth/userLogin")
      .send({
        email: testUserData.email,
        password: "password123",
      });

    expect(loginRes.status).toBe(200);

    return {
      userId,
      authToken: loginRes.body.token,
    };
  };

  // Test 1: Successful creation of leave request
  test("1. Should create leave request successfully", async () => {
    const { userId, authToken } = await createTestUser();

    const validLeaveRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(validLeaveRequest);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Leave request created successfully.");
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.leaveType).toBe(validLeaveRequest.leaveType);
    expect(response.body.data.reason).toBe(validLeaveRequest.reason);
    expect(response.body.data.sts).toBe("pending");

    // Check if requestedBy is populated (could be user object or just ID)
    // The helper function populateLeaveRequestDetails populates the user
    expect(response.body.data.requestedBy).toBeDefined();
  });

  // Test 2: Missing required field (leaveType)
  test("2. Should fail when leaveType is missing", async () => {
    const { authToken } = await createTestUser();

    const invalidRequest = {
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("validation failed");
    expect(response.body.errors).toContain("leaveType is required");
  });

  // Test 3: Short reason
  test("3. Should fail when reason is too short", async () => {
    const { authToken } = await createTestUser();

    const invalidRequest = {
      leaveType: "Annual Leave",
      reason: "Short",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain(
      "Reason must be at least 10 characters"
    );
  });

  // Test 4: Past start date
  test("4. Should fail when start date is in the past", async () => {
    const { authToken } = await createTestUser();

    const invalidRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: "2023-01-01",
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain("Start date cannot be in the past");
  });

  // Test 5: End date before start date
  test("5. Should fail when end date is before start date", async () => {
    const { authToken } = await createTestUser();

    const invalidRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(14),
      endDate: getFutureDate(7),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain("End date must be after start date");
  });

  // Test 6: No authentication token
  test("6. Should fail without authentication token", async () => {
    await createTestUser(); // Create user but don't use token

    const validLeaveRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .send(validLeaveRequest);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Access denied. No token provided.");
  });
});

describe("DELETE Leave Request APIs", () => {
  const getFutureDate = (daysFromNow = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  // Helper to create test user
  const createTestUser = async () => {
    const timestamp = Date.now();
    const testUserData = {
      name: "Test Employee DELETE",
      role: 1,
      email: `testdelete${timestamp}@example.com`,
      password: "password123",
    };

    // Register
    const registerRes = await request(app)
      .post("/api/v1/userAuth/userRegistration")
      .send(testUserData);
    const userId = registerRes.body.data.userid;

    // Login
    const loginRes = await request(app)
      .post("/api/v1/userAuth/userLogin")
      .send({
        email: testUserData.email,
        password: "password123",
      });
    const authToken = loginRes.body.token;

    return { userId, authToken };
  };

  // Helper to create leave request
  const createLeaveRequest = async (authToken, leaveData = {}) => {
    const defaultData = {
      leaveType: "Sick Leave",
      reason: "I am not feeling well and need to see a doctor.",
      startDate: getFutureDate(7),
      endDate: getFutureDate(8),
      ...leaveData,
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(defaultData);

    return response.body.data._id;
  };

  // Test 7: Successful deletion
  test("7. Should delete leave request successfully", async () => {
    const { userId, authToken } = await createTestUser();

    // Create a leave request
    const leaveRequestId = await createLeaveRequest(authToken);

    // Delete it
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${leaveRequestId}`)
      .set("Authorization", authToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Leave request deleted successfully.");
  });

  // Test 8: Invalid ID format
  test("8. Should fail with invalid ID format", async () => {
    const { authToken } = await createTestUser();

    const response = await request(app)
      .delete("/api/v1/leave-request/deleteLeave/invalid-id")
      .set("Authorization", authToken);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid ID format.");
  });

  // Test 9: Non-existent leave request
  test("9. Should fail with non-existent leave request", async () => {
    const { authToken } = await createTestUser();

    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${nonExistentId}`)
      .set("Authorization", authToken);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Leave request not found.");
  });

  // Test 10: Cannot delete approved leave request
  test("10. Should not delete approved leave request", async () => {
    const { userId, authToken } = await createTestUser();

    // Create and approve a leave request
    const approvedLeave = new LeaveRequest({
      leaveType: "Annual Leave",
      reason: "Vacation for family reunion",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
      sts: "approved",
      requestedBy: userId,
    });
    await approvedLeave.save();

    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${approvedLeave._id}`)
      .set("Authorization", authToken);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Cannot delete leave request");
  });

  // Test 11: Different user cannot delete
  test("11. Should fail when different user tries to delete", async () => {
    // Create first user and leave request
    const { userId: user1Id, authToken: user1Token } = await createTestUser();
    const leaveRequestId = await createLeaveRequest(user1Token);

    // Create second user
    const timestamp = Date.now() + 1000;
    const otherUserData = {
      name: "Other User",
      role: 1,
      email: `other${timestamp}@example.com`,
      password: "password123",
    };

    await request(app)
      .post("/api/v1/userAuth/userRegistration")
      .send(otherUserData);

    const otherLoginRes = await request(app)
      .post("/api/v1/userAuth/userLogin")
      .send({
        email: otherUserData.email,
        password: "password123",
      });

    const otherToken = otherLoginRes.body.token;

    // Try to delete with other user's token
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${leaveRequestId}`)
      .set("Authorization", otherToken);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("You don't have permission");

    // Verify original user can still delete it
    const originalUserResponse = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${leaveRequestId}`)
      .set("Authorization", user1Token);

    expect(originalUserResponse.status).toBe(200);
    expect(originalUserResponse.body.success).toBe(true);
  });
});
