describe("Item Creation Page Category Dropdown", () => {
  it("shows updated categories after a category has been edited for items", () => {
    // Intercept the GET request for categories
    cy.intercept("POST", "**/category/**/update", {
      statusCode: 200,
      body: {
        /* Your mock response body if needed */
      },
    }).as("updateCategory");

    // Visit the Categories page and click the 'Edit' button for "Books"
    cy.visit("localhost:3000/categories");
    cy.contains("tr", "Books").find("button").contains("Edit").click();

    // Ensure the edit page has loaded and input fields are visible
    cy.url().should("include", "/edit");
    cy.get('input[placeholder="Science"]').should("be.visible");

    // Mock entering a new category name without actually changing the database
    cy.get('input[placeholder="Science"]').clear().type("Book");

    // Click the submit button to send the update request
    cy.get('button[type="submit"]').click();

    cy.wait("@updateCategory").its("request.body").should("include", {
      name: "Book",
    });

    cy.intercept("GET", "**/categories", {
      statusCode: 200,
      body: [
        {
          id: 3,
          name: "Book",
        },
      ],
    }).as("fetchCategories");

    cy.visit("http://localhost:3000/items");
    cy.contains("Hammer").click();
    cy.get(".tabler-icon-edit").click();
    cy.wait("@fetchCategories"); // Ensure the updated categories are fetched

    cy.contains("label", "Category")
      .next()
      .children("select")
      .should("contain", "Book");
    cy.contains("label", "Category")
      .next()
      .children("select")
      .should("not.contain", "Books");
  });

  it("does not show deleted categories when creating/editing items", () => {
    // Intercept the DELETE request for a category
    cy.intercept("POST", "**/category/**/delete", {
      statusCode: 200,
    }).as("deleteCategory");

    // Navigate to the category deletion interface in your app
    cy.visit("http://localhost:3000/categories");
    // Replace the below with the actual actions to delete a category
    cy.contains("tr", "Tools").within(() => {
      cy.window().then((win) => {
        cy.stub(win, "prompt").returns("1234");
      });
      cy.get("button").contains("Delete").click();
    });
    cy.wait("@deleteCategory");

    cy.intercept("GET", "**/categories", {
      statusCode: 200,
      body: [
        {
          id: 0,
          name: "Electronics",
        },
        {
          id: 1,
          name: "Clothing",
        },
        {
          id: 2,
          name: "Groceries",
        },
        {
          id: 3,
          name: "Books",
        },
        {
          id: 4,
          name: "Home Decor",
        },
        {
          id: 5,
          name: "Toys",
        },
        {
          id: 6,
          name: "Furniture",
        },
        {
          id: 8,
          name: "Sports Equipment",
        },
      ],
    }).as("fetchCategories");

    // Now, visit the item creation or editing page to verify the updated category list
    cy.visit("http://localhost:3000/items");
    cy.contains("Hammer").click();
    cy.get(".tabler-icon-edit").click();
    cy.wait("@fetchCategories"); // Ensure the updated categories are fetched

    // Assert the deleted category is not present
    cy.contains("label", "Category")
      .next()
      .children("select")
      .should("not.contain", "Tools");
  });
});
