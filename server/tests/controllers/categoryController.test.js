import { describe, it, expect, vi } from "vitest";
import * as categoryController from "../../controllers/categoryController";
import Category from "../../models/category";

// Mock the Category model
vi.mock("../../models/category", () => {
  return {
    find: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    exec: vi
      .fn()
      .mockResolvedValue([
        { name: "Category 1", description: "Description 1" },
      ]),
    findById: vi.fn().mockResolvedValue({
      _id: "123",
      name: "Category 1",
      description: "Description 1",
    }),
  };
});

describe("Category Controller", () => {
  describe("category_list", () => {
    it("should return a list of categories", async () => {
      const req = {};
      const res = { json: vi.fn() };
      await categoryController.category_list(req, res);
      expect(Category.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { name: "Category 1", description: "Description 1" },
      ]);
    });
  });

  describe("category_detail", () => {
    it("should return category details", async () => {
      const req = { params: { id: "123" } };
      const res = { json: vi.fn() };
      await categoryController.category_detail(req, res);
      expect(Category.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({
        _id: "123",
        name: "Category 1",
        description: "Description 1",
      });
    });
  });

  // Add more tests here for other functions
});
