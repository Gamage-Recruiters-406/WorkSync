// Backend/__tests__/api_tests/leaveRequest/delete.test.js
import { describe, expect, test, beforeEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import LeaveRequest from "../../../models/LeaveRequest.js";
import app from "../../../app.js";

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

describe("DELETE /api/v1/leave-request/deleteLeave/:id - Delete Leave Request", () => {
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

  // Test 1: Successful deletion
  test("Should delete leave request successfully", async () => {
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

  // Test 2: Invalid ID format
  test("Should fail with invalid ID format", async () => {
    const { authToken } = await createTestUser();

    const response = await request(app)
      .delete("/api/v1/leave-request/deleteLeave/invalid-id")
      .set("Authorization", authToken);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid ID format.");
  });

  // Test 3: Non-existent leave request
  test("Should fail with non-existent leave request", async () => {
    const { authToken } = await createTestUser();

    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${nonExistentId}`)
      .set("Authorization", authToken);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Leave request not found.");
  });

  // Test 4: Cannot delete approved leave request
  test("Should not delete approved leave request", async () => {
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

  // Test 5: Different user cannot delete
  test("Should fail when different user tries to delete", async () => {
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
