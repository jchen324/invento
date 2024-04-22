import React from "react";
import { wrapWithProviders } from "../support/wrapWithProviders";
import FooterSimple from "../../components/FooterSimple";

describe("FooterSimple Component", () => {
  it("renders correctly with links", () => {
    cy.mount(wrapWithProviders(<FooterSimple />));

    // Verify the presence and content of the link
    cy.get("a")
      .should("have.attr", "href", "https://github.com/creme332/invento")
      .contains("Made by creme332");
  });
});
