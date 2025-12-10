export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".js"],
  testMatch: ["**/__tests__/**/*.test.js"],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
};
