import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Define test environment settings here
    globals: true,
    environment: "node",
  },
});
