import { describe, it, expect, vi } from "vitest";
import * as itemController from "../../controllers/itemController";
import Item from "../../models/item";

// Mock the Item model
vi.mock("../../models/item", () => {
  return {
    find: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    exec: vi
      .fn()
      .mockResolvedValue([{ name: "Item 1", description: "Description 1" }]),
    findById: vi.fn().mockResolvedValue({
      _id: "123",
      name: "Item 1",
      description: "Description 1",
    }),
    aggregate: vi.fn(),
  };
});

describe("Item Controller", () => {
  describe("item_list", () => {
    it("should return a list of items", async () => {
      const req = {};
      const res = { json: vi.fn() };
      await itemController.item_list(req, res);
      expect(Item.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { name: "Item 1", description: "Description 1" },
      ]);
    });
  });

  describe("item_detail", () => {
    it("should return item details", async () => {
      const req = { params: { id: "123" } };
      const res = { json: vi.fn() };
      await itemController.item_detail(req, res);
      expect(Item.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({
        _id: "123",
        name: "Item 1",
        description: "Description 1",
      });
    });
  });

  // Add more tests here for other functions
});
