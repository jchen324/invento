import { describe, it, expect } from "vitest";
import supertest from "supertest";
import app from "../app.js"; // Adjust the path as necessary

const request = supertest(app);

describe("Category Routes", () => {
  it("should retrieve all categories", async () => {
    const response = await request.get("/categories");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Add more tests for each endpoint
});

describe("Item Routes", () => {
  it("should retrieve all items", async () => {
    const response = await request.get("/items");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // More tests for other item endpoints
});
