import { describe, it, expect } from "vitest";
import supertest from "supertest";
import createApp from "../../app.js";
import {
  createCategories,
  createItems,
  clearDatabase,
} from "./populateHelper.js";
const Category = require("../../models/category");
const Item = require("../../models/item");

const request = supertest(
  createApp(
    "mongodb+srv://taimingshi:taimingshi@cluster0.irhi7sd.mongodb.net/invento-backend-test?retryWrites=true&w=majority"
  )
);
const expectedCategories = [
  {
    name: "Electronics",
    description: "Devices and gadgets that operate through electronic systems",
  },
  {
    name: "Clothing",
    description: "Various types of apparel for men, women, and children",
  },
  {
    name: "Groceries",
    description: "Food and household items for daily consumption",
  },
  {
    name: "Home Decor",
    description:
      "Items used to decorate and enhance the aesthetic appeal of homes",
  },
];

const expectedItems = [
  {
    name: "Smartphone",
    description: "A high-end smartphone",
    category: "Electronics",
    status: "Reserved",
    stock: 20,
  },
  {
    name: "Jeans",
    description: "Comfortable blue jeans",
    category: "Clothing",
    status: "Loaned",
    stock: 50,
  },
  {
    name: "Milk",
    description: "A carton of fresh milk",
    category: "Groceries",
    status: "Available",
    stock: 100,
  },
  {
    name: "Table",
    description: "A sturdy wooden table",
    category: "Home Decor",
    status: "Available",
    stock: 10,
  },
];

describe("Category Routes", () => {
  beforeEach(async () => {
    const categories = await createCategories();
    await createItems(categories);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should retrieve all categories", async () => {
    const response = await request.get("/categories");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.map((cat) => ({
        name: cat.name,
        description: cat.description,
      }))
    ).toEqual(expect.arrayContaining(expectedCategories));
  });

  it("retrieve a single category", async () => {
    const allCategories = await request.get("/categories");
    const category = allCategories.body[0];
    const id = category._id;

    const response = await request.get("/category/" + id);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(category);
  });

  /*
	* FAILURE 1: returns status 500 instead of 400 when provided with random invalid id
	* This is because category_detail() function does not have a try catch block to catch the error thrown by mongoose
	* when the id is invalid, and the function terminates by throwing 500 server error instead of redirecting to the /categories endpoint.
	*/
  it("retrieve a single category with invalid id", async () => {
    const response = await request.get("/category/123");
    expect(response.status).toBe(400);
  });

  /*
	* FAILURE 2: does not return null in the body of the response when provided with non-existing mongoose id
	* This is because the category_detail function does not return after redirecting to the /categories endpoint,
	* causing the code to fall through and returning an empty object which shouldn't happen.
	*/
  it("retrieve a single category with non-existing mongoose id", async () => {
    const response = await request.get("/category/5f9b1b1b4f3b9b1b4f3b9b1b");
    console.log(response.body);
    expect(response.status).toBe(302);
    expect(response.body).toBe(null);
  });

  it("get total num of categories", async () => {
    const response = await request.get("/categories/total");
    expect(response.status).toBe(200);
    expect(response.body).toBe(4);
  });

  it("create a new category", async () => {
    const newCategory = {
      name: "Test Category",
      description: "This is a test category",
    };
    const response = await request.post("/category/create").send(newCategory);
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
    const allCategories = await request.get("/categories");
    expect(
      allCategories.body.map((cat) => ({
        name: cat.name,
        description: cat.description,
      }))
    ).toContainEqual(newCategory);
  });

  /*
	* FAILURE 3: when creating a new category that does not fulfill the minimum character requirement,
	* we are unable to access the error response message.
	* This is because the category_create_post function is incorrectly sending error messages through res.writeHead() 
	*/
  it("create a new category with invalid data", async () => {
    const newCategory = {
      name: "T",
      description: "This is a test category",
    };
    const response = await request.post("/category/create").send(newCategory);
    expect(response.status).toBe(400);
    expect(response.body).toContain("Name must have at least 3 characters.");
  });

  /*
	* FAILURE 4: when creating a new category with an existing name, we get 500 instead of 403 status code
	* This is because the category_create_post function forgets to await the Category.find() function.
	* Later on mongoose throws duplicate key error, which causes 500 server error to be thrown.
	*/
  it("create a new category with existing name", async () => {
    const newCategory = {
      name: "Electronics",
      description: "This is a test category",
    };
    const response = await request.post("/category/create").send(newCategory);
    expect(response.status).toBe(403);
    expect(response.body).toContain("Category Electronics already exists.");
  });

  it("update a category", async () => {
    const allCategories = await request.get("/categories");
    const category = allCategories.body[0];
    const id = category._id;
    const updatedCategory = {
      name: "Updated Category",
      description: "This is an updated category",
    };
    const response = await request
      .post("/category/" + id + "/update")
      .send(updatedCategory);
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
  });

  /*
	* FAILURE 5: when updating a category with invalid data, we do not get 400 status code, and 200 success instead
	* This is because the category_update_post function does not check for the minimum character requirement for name and description
	* This is inconsistent with the requirements that it has in the category_create_post function
	*/
  it("update a category with invalid data", async () => {
    const allCategories = await request.get("/categories");
    const category = allCategories.body[0];
    const id = category._id;
    const updatedCategory = {
      name: "T",
      description: "This is an updated category",
    };
    const response = await request
      .post("/category/" + id + "/update")
      .send(updatedCategory);
    expect(response.status).toBe(400); // get 200 instead， does not check for min 3 char
    expect(response.body).toContain("Name must have at least 3 characters.");
  });

  /*
	* FAILURE 6: when updating a category with non-existing id, we do not get 404 status code, and 200 success instead
	* This is because the category_update_post function does not check if the category exists before attempting to update it
	*/
  it("update a category with non-existing id", async () => {
    const updatedCategory = {
      name: "Updated Category",
      description: "This is an updated category",
    };
    const response = await request
      .post("/category/5f9b1b1b4f3b9b1b4f3b9b1b/update")
      .send(updatedCategory);
    expect(response.status).toBe(404); // still returns 200
  });

  it("update a category with invalid id", async () => {
    const updatedCategory = {
      name: "Updated Category",
      description: "This is an updated category",
    };
    const response = await request
      .post("/category/123/update")
      .send(updatedCategory);
    expect(response.status).toBe(500);
  });

  /*
	* FAILURE 7: when deleting a category without password, we are unable to get the correct error message
	* This is because the category_delete_post function is incorrectly sending error messages through res.writeHead()
	*/
  it("delete a category without password", async () => {
    const allCategories = await request.get("/categories");
    const category = allCategories.body[0];
    const id = category._id;
    const response = await request.post("/category/" + id + "/delete");
    expect(response.status).toBe(403);
    expect(response.text).toBe("Permission denied");
  });

  /*
	* FAILURE 8: when deleting a category with correct password that is used by existing item, we do not get the correct error message
	* This is because the category_delete_post function is incorrectly sending error messages through res.writeHead()
	*/
  it("delete category with correct password that is used by existing item", async () => {
    const allCategories = await request.get("/categories");
    const category = allCategories.body[0];
    const id = category._id;
    const response = await request
      .post("/category/" + id + "/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(403);
    expect(response.body).toContain("Cannot delete a category that is used by the following items:");
  });

  it("delete category with correct password that is not used by any item", async () => {
    const newCategory = {
      name: "Test Category",
      description: "This is a test category",
    };
    const response = await Category.create(newCategory);
    const id = response._id;
    const deleteResponse = await request
      .post("/category/" + id + "/delete")
      .send({ password: "1234" });
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.text).toBe("success");
  });

  /*
	* FAILURE 9: when deleting a category with an invalid random id, we do not get 400 status code, and 500 instead
	* This is because the category_delete_post function does not have a try catch block to catch the error thrown by mongoose
	* when the id is invalid, and the function terminates by throwing 500 server error.
	*/
  it("delete category with invalid id", async () => {
    const response = await request
      .post("/category/123/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(400);
  });

  it("delete category with non-existing id", async () => {
    const response = await request
      .post("/category/5f9b1b1b4f3b9b1b4f3b9b1b/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(404);
  });
});





describe("Item Routes", () => {
  beforeEach(async () => {
    const categories = await createCategories();
    await createItems(categories);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("get total num of items", async () => {
    const response = await request.get("/items/total");
    expect(response.status).toBe(200);
    expect(response.body).toBe(4);
  });

  it("get recent 3 items", async () => {
    const response = await request.get("/items/recent/3");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);
    expect(
      response.body.map((item) => ({
        name: item.name,
        description: item.description,
        status: item.status,
        stock: item.stock,
      }))
    ).toEqual(
      expect.arrayContaining([
        {
          name: "Jeans",
          description: "Comfortable blue jeans",
          status: "Loaned",
          stock: 50,
        },
        {
          name: "Milk",
          description: "A carton of fresh milk",
          status: "Available",
          stock: 100,
        },
        {
          name: "Table",
          description: "A sturdy wooden table",
          status: "Available",
          stock: 10,
        },
      ])
    );
  });

  it("get recent 50 items", async () => {
    const response = await request.get("/items/recent/50");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(4);
  });

  it("get items grouped by category", async () => {
    const response = await request.get("/items/grouped-by-category");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Object.keys(response.body).length).toBe(4);
    expect(response.body).toEqual(
      expect.arrayContaining([
        { totalItems: 1, category: "Electronics" },
        { totalItems: 1, category: "Home Decor" },
        { totalItems: 1, category: "Clothing" },
        { totalItems: 1, category: "Groceries" },
      ])
    );
  });

  it("get items grouped by status", async () => {
    const response = await request.get("/items/grouped-by-status");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Object.keys(response.body).length).toBe(3);
    console.log(response.body);
    expect(response.body).toEqual(
      expect.arrayContaining([
        { totalItems: 2, status: "Available" },
        { totalItems: 1, status: "Loaned" },
        { totalItems: 1, status: "Reserved" },
      ])
    );
  });

  it("should retrieve all items", async () => {
    const response = await request.get("/items");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      response.body.map((item) => ({
        name: item.name,
        description: item.description,
        category: item.category,
        status: item.status,
        stock: item.stock,
      }))
    ).toEqual(expect.arrayContaining(expectedItems));
  });

  it("retrieve a single item", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    const itemCategory = item.category;

    const response = await request.get("/item/" + id);
    expect(response.status).toBe(200);
    const categoryID = response.body.category;
    delete response.body.category; // do not check category field!
    delete item.category; // do not check category field!
    // do not check category field!
    expect(response.body).toMatchObject(item);
    const category = await request.get("/category/" + categoryID);
    expect(category.body.name).toMatchObject(itemCategory);
  });

  it("create a new item", async () => {
    const categories = await request.get("/categories");
    const category = categories.body[0];
    const newCategory = category._id;
    const newItem = {
      name: "Test Item",
      description: "This is a test item",
      status: "Available",
      stock: 100,
      price: 100,
      category: newCategory,
    };
    const response = await request.post("/item/create").send(newItem);
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
    // get all items and check if the new item is added
  });

	/*
	* FAILURE 10: when creating a new item with invalid name, we do not get the correct error message
	* This is because the item_create_post function is incorrectly sending error messages through res.writeHead()
	*/
  it("create a new item with invalid name", async () => {
    const categories = await request.get("/categories");
    const category = categories.body[0];
    const newCategory = category._id;
    const newItem = {
      name: "T",
      description: "This is a test item",
      status: "Available",
      stock: 100,
      price: 100,
      category: newCategory,
    };
    const response = await request.post("/item/create").send(newItem);
    expect(response.status).toBe(400);
    expect(response.body).toContain("Name must have at least 3 characters.");
  });

	/*
	* FAILURE 11: when creating a new item with invalid category, we get 500 instead of 400 status code
	* This is because the item_create_post function does not await for the Category.findById() function to complete
	* and mongoose later on throws an error which is uncaught and causes 500 server error to be thrown.
	*/
  it("create a new item with invalid category", async () => {
    const newItem = {
      name: "Test Item",
      description: "This is a test item",
      status: "Available",
      stock: 100,
      price: 100,
      category: "5f9b1b1b4f3b9b1b4f3b9b1b",
    };
    const response = await request.post("/item/create").send(newItem);
    expect(response.status).toBe(400);
  });

  it("create a new item with image", async () => {
    const categories = await request.get("/categories");
    const category = categories.body[0];
    const newCategory = category._id;
    const newItem = {
      name: "Test Item",
      description: "This is a test item",
      status: "Available",
      stock: 100,
      price: 100,
      category: newCategory,
      image: {
        url: "https://example.com/image.jpg",
        alt: "Image description",
      },
    };
    const response = await request.post("/item/create").send(newItem);
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
  });

  it("delete an item", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    const response = await request
      .post("/item/" + id + "/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
  });

	/*
	* FAILURE 12: when deleting an item without password, we do not get the correct error message
	* This is because the item_delete_post function is incorrectly sending error messages through res.writeHead()
	*/
  it("delete an item without password", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    const response = await request.post("/item/" + id + "/delete");
    expect(response.status).toBe(403);
    expect(response.text).toBe("Permission denied");
  });

  /*
	* FAILURE 13: when deleting an item with correct password that is used by existing item, we get an uncaught error
	* This is because the item_delete_post function does not check for valid IDs before attempting to delete the item
	*/
  it("delete an item with invalid id", async () => {
    const response = await request
      .post("/item/123/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(500);
  });

	/*
	* FAILURE 14: when deleting an item with non-existing id, we do not get 404 status code, and 500 instead
	* This is because the item_delete_post function does not await for the Item.findById() function to complete beore attempting to delete the item
	*/
  it("delete an item with non-existing id", async () => {
    const response = await request
      .post("/item/5f9b1b1b4f3b9b1b4f3b9b1b/delete")
      .send({ password: "1234" });
    expect(response.status).toBe(404);
  });

	/*
	* FAILURE 15: when deleting an item that has been already deleted, we do not get 404 status code, and 200 success instead
	* This is caused again by the item_delete_post function not checking for valid IDs before attempting to delete the item
	* The mongoose function Item.findByIdAndRemove() returns null when the item does not exist, and dosn't throw error either
	* Resulting in us getting a 200 success status code instead of 404
	*/
  it("delete an item that has been already deleted", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    await Item.findByIdAndRemove(id);
    const deleteAgainResponse = await request
      .post("/item/" + id + "/delete")
      .send({ password: "1234" });
    expect(deleteAgainResponse.status).toBe(404);
  });

  it("update an item", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    const updatedItem = {
      _id: id,
      name: "Updated Item",
      description: "This is an updated item",
      status: "Available",
      stock: 100,
      price: 100,
      category: item.category,
    };
    const response = await request
      .post("/item/" + id + "/update")
      .send(updatedItem);
    expect(response.status).toBe(200);
    expect(response.text).toBe("success");
  });

  /*
	* FAILURE 16: when updating an item with null object, we do not get a meaningful error message
	* This is because the item_update_post function is incorrectly sending error messages through res.writeHead()
	*/
  it("update an item with null object", async () => {
    const allItems = await request.get("/items");
    const item = allItems.body[0];
    const id = item._id;
    const updatedItem = null;
    const response = await request
      .post("/item/" + id + "/update")
      .send(updatedItem);
    expect(response.status).toBe(500);
    expect(response.body).toContain("Name must have at least 3 characters.");
  });
});
