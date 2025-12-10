// Backend/__tests__/api_tests/leaveRequest/create.test.js
import { describe, expect, test, beforeEach } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
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

describe("POST /api/v1/leave-request/addLeave - Create Leave Request", () => {
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
  test("Should create leave request successfully", async () => {
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
  test("Should fail when leaveType is missing", async () => {
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
  test("Should fail when reason is too short", async () => {
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
  test("Should fail when start date is in the past", async () => {
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
  test("Should fail when end date is before start date", async () => {
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
  test("Should fail without authentication token", async () => {
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
