export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  testTimeout: 30000,
  transform: {
    "^.+\\.js$": ["@swc/jest"],
  },
  // Only use teardown, no setup needed
  globalTeardown: "<rootDir>/jest.teardown.js",
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
};
