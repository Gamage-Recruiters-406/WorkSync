import mongoose from "mongoose";

export default async function () {
  console.log("🔧 Global Test Teardown - Starting");

  // Close all database connections
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 0) {
      console.log("Closing MongoDB connection...");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    }

    // Also try to disconnect from all connections
    if (mongoose.connections.length > 0) {
      for (let connection of mongoose.connections) {
        if (connection.readyState !== 0) {
          await connection.close();
        }
      }
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
  }

  console.log("✅ Global teardown complete");

  // Force exit after cleanup
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("🔚 Forcing Jest exit...");
      resolve();
    }, 100);
  });
}
