	import { describe, it, expect } from "vitest";
	import supertest from "supertest";
	import createApp from "../../app.js"; // Adjust the path as necessary


const request = supertest(createApp("mongodb+srv://taimingshi:taimingshi@cluster0.irhi7sd.mongodb.net/invento-backend-test?retryWrites=true&w=majority"));

	describe("Category Routes", () => {
		it("should retrieve all categories", async () => {
			const expectedCategories = [
				{ name: 'Books', description: 'Printed and digital reading materials, including novels, textbooks, and more' },
				{ name: 'Clothing', description: 'Various types of apparel for men, women, and children' },
				{ name: 'Electronics', description: 'Devices and gadgets that operate through electronic systems' },
				{ name: 'Furniture', description: 'Various types of movable objects intended to support various human activities' },
				{ name: 'Groceries', description: 'Food and household items for daily consumption' },
				{ name: 'Home Decor', description: 'Items used to decorate and enhance the aesthetic appeal of homes' },
				{ name: 'Sports Equipment', description: 'Gear and accessories used in various sports and recreational activities' },
				{ name: 'Tools', description: 'Instruments used to carry out particular functions or tasks' },
				{ name: 'Toys', description: 'Playthings for children that promote entertainment and learning' }
			];
			const response = await request.get("/categories");
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Array);
			// Check each object in response.body to match the corresponding object in expectedCategories
			expect(response.body.map(cat => ({
				name: cat.name,
				description: cat.description
			}))).toEqual(expect.arrayContaining(expectedCategories));
			console.log(response.body);
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
