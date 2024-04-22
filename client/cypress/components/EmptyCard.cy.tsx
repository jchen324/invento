import { wrapWithProviders } from "../support/wrapWithProviders";
import EmptyCard from "../../components/EmptyCard";
import React from "react";

describe("EmptyCard Component", () => {
  it("renders correctly", () => {
    cy.mount(wrapWithProviders(<EmptyCard />));

    // Check if the Card component renders
    cy.get("div").contains("+ New item").should("be.visible");

    // Check the link
    cy.get("a").should("have.attr", "href", "/edit/item?title=Create+new+item");
  });
});
