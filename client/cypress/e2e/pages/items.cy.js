describe("Items Page Tests", () => {
  beforeEach(() => {
    cy.visit("/items");
  });

  it("loads the correct page", () => {
    cy.url().should("include", "/items");
    cy.contains("All items"); // Checks for text to confirm the right page loaded
  });

  it("displays a list of items", () => {
    cy.get('[class*="ArticleCardFooter_card"]').should(
      "have.length.at.least",
      1
    );
  });

  it("can open the new item form", () => {
    cy.contains("+ New item").click();
    cy.url().should("include", "/edit/item");
    cy.contains("Create new item"); // Checks for text on the form
  });

  it("can click on an item to view details", () => {
    cy.contains("Screwdriver").click();
    cy.contains("A sturdy screwdriver for household repairs"); // Checks for description
    cy.contains("19.99"); // Checks for price
  });

  it("can add a new item", () => {
    // Mock the create item POST request
    cy.intercept("POST", "**/item/create", { statusCode: 200 }).as(
      "createItem"
    );

    cy.visit("/edit/item?title=Create+new+item");
    cy.contains("label", "Name").next().children("input").type("New Test Item");
    cy.contains("label", "Description")
      .next()
      .children("input")
      .type("This is a test description.");
    cy.contains("label", "Price").next().children("input").type("20");
    cy.contains("label", "Stock").next().children("input").type("5");
    cy.contains("label", "Category")
      .next()
      .children("select")
      .select("Electronics");
    cy.contains("label", "Status")
      .next()
      .children("select")
      .select("Available");
    cy.contains("button", "Submit").click();

    // Check request content
    cy.wait("@createItem").its("request.body").should("include", {
      name: "New Test Item",
      description: "This is a test description.",
      price: 20,
      stock: 5,
      status: "Available",
    });

    // Check redirection or UI update
    cy.url().should("include", "/items");
    cy.contains("All items");
  });

  it("can edit an item", () => {
    // Mock the fetch item request if any and update request
    cy.intercept("POST", "**/item/**/update", { statusCode: 200 }).as(
      "updateItem"
    );

    cy.contains("Hammer").click();
    cy.contains("9.99").should("be.visible"); // Ensure the page or component has loaded and displays the price $9.99
    cy.get(".tabler-icon-edit").click();
    cy.url().should("include", "/edit");
    cy.contains("label", "Price").next().children("input").clear().type("10");
    cy.contains("button", "Submit").click();

    // Wait for the POST request to complete
    cy.wait("@updateItem").its("request.body").should("include", {
      name: "Hammer",
      description: "A sturdy hammer for household repairs",
      price: "10",
      stock: 25,
      status: "Available",
    });
  });

  it("can send a delete request with the password entered", () => {
    cy.intercept("POST", "**/item/**/delete", (req) => {
      if (req.body.password === "adminPassword") {
        return req.reply({
          statusCode: 200,
          ok: true,
        });
      } else {
        return req.reply({
          statusCode: 403,
          ok: false,
        });
      }
    }).as("deleteRequest");

    cy.contains("Hammer").click();
    cy.contains("9.99").should("be.visible"); // Ensure the page or component has loaded and displays the price $9.99

    // Stub the prompt to return the correct password
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("adminPassword");
    });

    // Trigger the delete operation
    cy.get('[data-testid="delete-button"]').click();

    // Wait for the API call to complete
    cy.wait("@deleteRequest").its("response.statusCode").should("eq", 200);

    // Verify redirection to the items page
    cy.url().should("include", "/items");
  });

  it("fails to delete an item with incorrect password", () => {
    cy.intercept("POST", "**/item/**/delete", (req) => {
      if (req.body.password === "adminPassword") {
        return req.reply({
          statusCode: 200,
          ok: true,
        });
      } else {
        return req.reply({
          statusCode: 403,
          ok: false,
        });
      }
    }).as("deleteRequest");

    cy.contains("Hammer").click();
    cy.contains("9.99").should("be.visible"); // Ensure the page or component has loaded and displays the price $9.99

    // Stub the prompt to return an incorrect password
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("wrongPassword");
    });

    // Trigger the delete operation
    cy.get('[data-testid="delete-button"]').click();

    // Wait for the API call to complete
    cy.wait("@deleteRequest").its("response.statusCode").should("eq", 403);

    // Check that an error message is displayed
    cy.contains("Forbidden").should("be.visible");

    // Check that we are still on the same page
    cy.url().should("not.include", "/items");
  });
});
