	import { describe, it, expect } from "vitest";
	import supertest from "supertest";
	import createApp from "../../app.js"; 
	import { createCategories, createItems, clearDatabase } from "./populateHelper.js";


const request = supertest(createApp("mongodb+srv://taimingshi:taimingshi@cluster0.irhi7sd.mongodb.net/invento-backend-test?retryWrites=true&w=majority"));

	describe("Category Routes", () => {
		beforeEach(async () => {
			const categories = await createCategories();
			await createItems(categories);
	});

	afterEach(async () => {
			await clearDatabase();
	});

		it("should retrieve all categories", async () => {
			const expectedCategories = [
				{ name: "Electronics", description: "Devices and gadgets that operate through electronic systems" },
        { name: "Clothing", description: "Various types of apparel for men, women, and children" },
        { name: "Groceries", description: "Food and household items for daily consumption" },
				{ name: "Home Decor", description: "Items used to decorate and enhance the aesthetic appeal of homes" },
			];
			const response = await request.get("/categories");
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Array);
			expect(response.body.map(cat => ({
				name: cat.name,
				description: cat.description
			}))).toEqual(expect.arrayContaining(expectedCategories));
			console.log(response.body);
		});

		
		it("should retrieve a single category", async () => {
			const allCategories = await request.get("/categories");
			const category = allCategories.body[0];
			const id = category._id;

			const response = await request.get("/category/" + id);
			expect(response.status).toBe(200);
			expect(response.body).toMatchObject(category);
		});

		it("get total num of categories", async () => {
			const response = await request.get("/categories/total");
			expect(response.status).toBe(200);
			expect(response.body).toBe(4);
		});

		it("create a new category", async () => {
			const newCategory = {
				name: "Test Category",
				description: "This is a test category"
			};
			const response = await request.post("/category/create").send(newCategory);
			expect(response.status).toBe(200); 
			expect(response.text).toBe("success");
		});
	});

	// describe("Item Routes", () => {
	// 	it("should retrieve all items", async () => {
	// 		const response = await request.get("/items");
	// 		expect(response.status).toBe(200);
	// 		expect(response.body).toBeInstanceOf(Array);
	// 	});

	// });
