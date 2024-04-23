import { describe, it, expect, vi} from "vitest";
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

describe('Categories Page Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    console.log("Browser launched");
    page = await browser.newPage();
    console.log("New page opened");
    await page.goto('http://localhost:3000/categories');
    console.log("Navigated to categories page");
});

afterAll(async () => {
    console.log("Closing page");
    if (page) {
        await page.close();
    }
    console.log("Closing browser");
    if (browser) {
        await browser.close();
    }
});

  it('should display all categories', async () => {
      const categories = await page.$$eval('.category-name', elements => elements.map(e => e.textContent.trim()));
      const expectedCategories = ['Books', 'Electronics', 'Clothing', 'Furniture']; // Update as needed
      expectedCategories.forEach(category => {
          expect(categories).toContain(category);
      });
  });
});



// describe('category_list', () => {
//   it('should return all categories', async () => {
//     const req = {};  // Mock req object if needed
//     const res = { json: vi.fn() };  // Mock response object

//     // Call the controller method
//     await categoryController.category_list(req, res);

//     // Test if the Category model's find and exec methods are called properly
//     expect(Category.find).toHaveBeenCalled();
//     expect(Category.sort).toHaveBeenCalledWith({ name: 1 });
//     expect(Category.exec).toHaveBeenCalled();

//     // Test if res.json is called with the right data
//     expect(res.json).toHaveBeenCalledWith([
//       { name: 'Category 1', description: 'Description 1' },
//       { name: 'Category 2', description: 'Description 2' }
//     ]);
//   });
// });

// describe("Category Controller", () => {
//   describe("category_list", () => {
//     it("should return a list of categories", async () => {
//       const req = {};
//       const res = { json: vi.fn() };
//       await categoryController.category_list(req, res);
//       expect(Category.find).toHaveBeenCalled();
//       expect(res.json).toHaveBeenCalledWith([
//         { name: "Category 1", description: "Description 1" },
//       ]);
//     });
//   });

//   describe("category_detail", () => {
//     it("should return category details", async () => {
//       const req = { params: { id: "123" } };
//       const res = { json: vi.fn() };
//       await categoryController.category_detail(req, res);
//       expect(Category.findById).toHaveBeenCalledWith("123");
//       expect(res.json).toHaveBeenCalledWith({
//         _id: "123",
//         name: "Category 1",
//         description: "Description 1",
//       });
//     });
//   });

  // Add more tests here for other functions
// });
