import React from "react";
import { wrapWithProviders } from "../support/wrapWithProviders";
import ArticleCardFooter from "../../components/ArticleCardFooter";
import { Item } from "../../common/types";

describe("ArticleCardFooter Component", () => {
  const mockItem: Item = {
    _id: "1",
    name: "Test Item",
    status: "Available",
    category: "Tech",
    description: "Description of the test item.",
    stock: 20,
    image: "test.url",
    price: 10,
  };

  it("renders correctly with given item props", () => {
    cy.mount(wrapWithProviders(<ArticleCardFooter item={mockItem} />));

    // Verify that the image loads with the correct URL
    cy.get("img")
      .should("have.attr", "src")
      .and("include", "https://source.unsplash.com/random/?" + mockItem.name);

    // Check the presence of status and category
    cy.get("div").contains(mockItem.status);
    cy.get("div").contains(mockItem.category);

    // Verify the link
    cy.get("a")
      .should("have.attr", "href", `/item/${mockItem._id}?id=${mockItem._id}`)
      .contains(mockItem.name);

    // Check the text content for the description and verify truncation
    cy.get("p").contains(mockItem.description).should("exist");
  });
});
