import React from "react";
import { wrapWithProviders } from "../../support/wrapWithProviders";
import HorizontalBarChart from "../../../components/charts/HorizontalBarChart";

describe("HorizontalBarChart Component", () => {
  it("renders correctly with default props", () => {
    cy.mount(wrapWithProviders(<HorizontalBarChart />));
    cy.get("canvas").should("be.visible");
    cy.get('canvas[role="img"]').should("be.visible");
  });

  it("updates dataset when props change", () => {
    cy.mount(
      wrapWithProviders(
        <HorizontalBarChart
          labelsArray={["Books", "Movies", "Music"]}
          dataArray={[15, 9, 20]}
        />
      )
    );
    cy.get("canvas").should("be.visible");

    // Use visual testing to test the content of the bar chart by
    // checking if the bar chart generated is the same as the baseline
    cy.compareSnapshot({
      name: "bar-chart",
      testThreshold: 0.2,
    });
  });
});
