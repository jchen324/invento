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

  it("The stock will be automatically round down to 100", () => {
    // Mock the create item POST request
    cy.intercept("POST", "**/item/create", { statusCode: 200 }).as(
      "createItem"
    );
    cy.visit("/edit/item?title=Create+new+item");
    cy.contains("label", "Name").next().children("input").type("Test");
    cy.contains("label", "Description")
      .next()
      .children("input")
      .type("This is a test description.");

    cy.contains("label", "Price").next().children("input").type("10");

    // Continue filling out the rest of the form
    cy.contains("label", "Stock").next().children("input").type("200");
    cy.contains("label", "Category")
      .next()
      .children("select")
      .select("Electronics");
    cy.contains("label", "Status")
      .next()
      .children("select")
      .select("Available");

    cy.contains("button", "Submit").click();
    cy.wait("@createItem").then((interception) => {
      cy.visit("http://localhost:3000/items");
      cy.contains("Test").click();
      // it should display the correct stock
      cy.contains("200");
      expect(interception.request.body).to.have.property("stock", 200);
    });
  });
});
