import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8", // specify the coverage provider, c8 is the default for Vitest
      exclude: ["node_modules/**", "tests/**", "*.config.js"], // exclude node_modules, test files, and config files from coverage
      reportsDirectory: "./coverage", // specify where to output coverage reports
      reporter: ["text", "html"], // specify types of coverage reports to generate
      all: false, // whether to include all files in the coverage report, not just files that have tests
    },
  },
});
