import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import User from "../models/User.js";
import LeaveRequest from "../models/LeaveRequest.js";

// Import the test app
import app from "../testApp.js";

describe("Leave Controller APIs", () => {
  let authToken;
  let userId;
  let createdLeaveIds = [];
  let testUsers = [];

  beforeAll(async () => {
    console.log("Setting up test database...");

    // Generate unique test user
    const timestamp = Date.now();
    const testUserEmail = `testemployee${timestamp}@test.com`;

    const testUserData = {
      name: "Test Employee",
      role: 1,
      email: testUserEmail,
      password: "password123",
    };

    try {
      // Create test user
      const registerRes = await request(app)
        .post("/api/v1/userAuth/userRegistration")
        .send(testUserData);

      expect(registerRes.status).toBe(201);
      userId = registerRes.body.data.userid;
      testUsers.push(userId);

      // Login to get token
      const loginRes = await request(app)
        .post("/api/v1/userAuth/userLogin")
        .send({
          email: testUserEmail,
          password: "password123",
        });

      expect(loginRes.status).toBe(200);
      authToken = loginRes.body.token;

      console.log("Test setup complete. User created and authenticated.");
    } catch (error) {
      console.error("Setup error:", error.message);
      throw error;
    }
  }, 10000);

  afterAll(async () => {
    console.log("Cleaning up test data...");

    try {
      // Delete all created leave requests
      if (createdLeaveIds.length > 0) {
        await LeaveRequest.deleteMany({ _id: { $in: createdLeaveIds } });
        console.log(`Deleted ${createdLeaveIds.length} leave requests`);
      }

      // Delete test users
      if (testUsers.length > 0) {
        await User.deleteMany({ _id: { $in: testUsers } });
        console.log(`Deleted ${testUsers.length} test users`);
      }

      console.log("Test cleanup completed.");
    } catch (error) {
      console.error("Cleanup error:", error.message);
    }
  }, 10000);

  // Helper function to get future dates
  const getFutureDate = (daysFromNow = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Test Case 1: Successful creation of leave request
  test("1. Successful creation of leave request", async () => {
    const validLeaveRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(7), // 7 days from now
      endDate: getFutureDate(14), // 14 days from now
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(validLeaveRequest);

    console.log("Response:", response.body);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Leave request created successfully.");
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.leaveType).toBe(validLeaveRequest.leaveType);
    expect(response.body.data.reason).toBe(validLeaveRequest.reason);
    expect(response.body.data.sts).toBe("pending");

    // Store for cleanup
    createdLeaveIds.push(response.body.data._id);
  });

  // Test Case 2: Leave request with leaveType not mentioned
  test("2. Leave request with leaveType not mentioned", async () => {
    const invalidRequest = {
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    console.log("Response for missing leaveType:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("validation failed");
    expect(response.body.errors).toContain("leaveType is required");
  });

  // Test Case 3: Creation with short reason
  test("3. Creation with short reason", async () => {
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

    console.log("Response for short reason:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain(
      "Reason must be at least 10 characters"
    );
  });

  // Test Case 4: Creation with start date in past
  test("4. Creation with start date in past", async () => {
    // Use a date that's definitely in the past
    const invalidRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: "2023-01-01", // Definitely in the past
      endDate: getFutureDate(14),
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    console.log("Response for past date:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain("Start date cannot be in the past");
  });

  // Test Case 5: Creation with end date before start date
  test("5. Creation with end date before start date", async () => {
    const invalidRequest = {
      leaveType: "Annual Leave",
      reason: "I need a vacation for personal reasons and family time.",
      startDate: getFutureDate(14),
      endDate: getFutureDate(7), // End date before start date
    };

    const response = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send(invalidRequest);

    console.log("Response for end before start:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain("End date must be after start date");
  });

  // Additional test: Should fail without authentication token
  test("Should fail without authentication token", async () => {
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

// Separate describe block for DELETE tests to manage setup better
describe("DELETE Leave Request APIs", () => {
  let authToken;
  let userId;
  let createdLeaveIds = [];
  let testUsers = [];

  // Helper function to get future dates
  const getFutureDate = (daysFromNow = 7) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  beforeAll(async () => {
    console.log("Setting up DELETE test database...");

    // Generate unique test user for DELETE tests
    const timestamp = Date.now();
    const testUserEmail = `testemployee${timestamp}@test.com`;

    const testUserData = {
      name: "Test Employee DELETE",
      role: 1,
      email: testUserEmail,
      password: "password123",
    };

    // Create test user
    const registerRes = await request(app)
      .post("/api/v1/userAuth/userRegistration")
      .send(testUserData);

    expect(registerRes.status).toBe(201);
    userId = registerRes.body.data.userid;
    testUsers.push(userId);

    // Login to get token
    const loginRes = await request(app)
      .post("/api/v1/userAuth/userLogin")
      .send({
        email: testUserEmail,
        password: "password123",
      });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.token;

    console.log("DELETE test setup complete.");
  }, 10000);

  afterAll(async () => {
    console.log("Cleaning up DELETE test data...");

    // Delete all created leave requests
    if (createdLeaveIds.length > 0) {
      await LeaveRequest.deleteMany({ _id: { $in: createdLeaveIds } });
      console.log(
        `Deleted ${createdLeaveIds.length} leave requests from DELETE tests`
      );
    }

    // Delete test users
    if (testUsers.length > 0) {
      await User.deleteMany({ _id: { $in: testUsers } });
      console.log(`Deleted ${testUsers.length} test users from DELETE tests`);
    }

    console.log("DELETE test cleanup completed.");
  }, 10000);

  // Test Case 6: Successful deletion
  test("6. Successful deletion", async () => {
    // First create a leave request
    const createRes = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send({
        leaveType: "Sick Leave",
        reason: "I am not feeling well and need to see a doctor.",
        startDate: getFutureDate(7),
        endDate: getFutureDate(8),
      });

    console.log("Create response:", createRes.body);
    expect(createRes.status).toBe(201);
    const leaveRequestId = createRes.body.data._id;
    createdLeaveIds.push(leaveRequestId);

    // Now delete it
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${leaveRequestId}`)
      .set("Authorization", authToken);

    console.log("Delete response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Leave request deleted successfully.");

    // Remove from cleanup array since it's already deleted
    const index = createdLeaveIds.indexOf(leaveRequestId);
    if (index > -1) {
      createdLeaveIds.splice(index, 1);
    }
  });

  // Test Case 7: Delete with invalid id format
  test("7. Delete with invalid id format", async () => {
    const response = await request(app)
      .delete("/api/v1/leave-request/deleteLeave/invalid-id")
      .set("Authorization", authToken);

    console.log("Invalid ID response:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid ID format.");
  });

  // Test Case 8: Delete with non-existent leave request
  test("8. Delete with non-existent leave request", async () => {
    // Generate a valid ObjectId that doesn't exist
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${nonExistentId}`)
      .set("Authorization", authToken);

    console.log("Non-existent ID response:", response.body);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Leave request not found.");
  });

  // Test: Should not delete approved leave request
  test("Should not delete approved leave request", async () => {
    // Create an approved leave request
    const approvedLeave = new LeaveRequest({
      leaveType: "Annual Leave",
      reason: "Vacation for family reunion",
      startDate: getFutureDate(7),
      endDate: getFutureDate(14),
      sts: "approved",
      requestedBy: userId,
    });
    await approvedLeave.save();

    createdLeaveIds.push(approvedLeave._id);

    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${approvedLeave._id}`)
      .set("Authorization", authToken);

    console.log("Approved delete response:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Cannot delete leave request");
  });

  // Test: Should fail with other user's token
  test("Should fail with other user's token", async () => {
    // Create another test user
    const otherTimestamp = Date.now() + 1000;
    const otherUserEmail = `otheruser${otherTimestamp}@test.com`;
    const otherUserData = {
      name: "Other User",
      role: 1,
      email: otherUserEmail,
      password: "password123",
    };

    // Register other user
    const otherRegisterRes = await request(app)
      .post("/api/v1/userAuth/userRegistration")
      .send(otherUserData);

    expect(otherRegisterRes.status).toBe(201);
    const otherUserId = otherRegisterRes.body.data.userid;
    testUsers.push(otherUserId);

    // Login as other user
    const otherLoginRes = await request(app)
      .post("/api/v1/userAuth/userLogin")
      .send({
        email: otherUserEmail,
        password: "password123",
      });

    expect(otherLoginRes.status).toBe(200);
    const otherToken = otherLoginRes.body.token;

    // Create a leave request with first user
    const newLeaveRes = await request(app)
      .post("/api/v1/leave-request/addLeave")
      .set("Authorization", authToken)
      .send({
        leaveType: "Casual Leave",
        reason: "Need to attend a family function",
        startDate: getFutureDate(7),
        endDate: getFutureDate(8),
      });

    expect(newLeaveRes.status).toBe(201);
    const newLeaveId = newLeaveRes.body.data._id;
    createdLeaveIds.push(newLeaveId);

    // Try to delete with other user's token
    const response = await request(app)
      .delete(`/api/v1/leave-request/deleteLeave/${newLeaveId}`)
      .set("Authorization", otherToken);

    console.log("Other user delete response:", response.body);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("You don't have permission");
  });
});

