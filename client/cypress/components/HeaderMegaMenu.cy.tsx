import React from "react";
import { wrapWithProviders } from "../support/wrapWithProviders";
import HeaderMegaMenu from "../../components/HeaderMegaMenu";
import "../../styles/HeaderMegaMenu.module.css";

describe("HeaderMegaMenu Component", () => {
  beforeEach(() => {
    cy.mount(wrapWithProviders(<HeaderMegaMenu />));
  });

  it("renders the header with navigation links", () => {
    cy.get("a").contains("Home").should("have.attr", "href", "/");
    cy.get("a").contains("Items").should("have.attr", "href", "/items");
    cy.get("a")
      .contains("Categories")
      .should("have.attr", "href", "/categories");
  });

  it("toggles the drawer when the Burger menu is clicked", () => {
    cy.get('button[aria-label="Open menu"]')
      .as("burgerButton")
      .should("be.visible");

    // Open the drawer
    cy.get("@burgerButton").click();
    cy.get("h2").contains("Navigation").should("be.visible");

    // Check if the links are replicated in the Drawer
    cy.get("a").contains("Home").should("have.attr", "href", "/");
    cy.get("a").contains("Items").should("have.attr", "href", "/items");
    cy.get("a")
      .contains("Categories")
      .should("have.attr", "href", "/categories");

    // Close the drawer
    cy.get('button[class*="mantine-Drawer-close"]').click();
    cy.contains("Navigation").should("not.exist");
  });
});
