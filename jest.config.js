const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src/tests"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts",
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ]
};
