import React from "react";
import { wrapWithProviders } from "../../support/wrapWithProviders";
import HorizontalBarChart from "../../../components/charts/HorizontalBarChart";
import { Item } from "../../../common/types";

describe("HorizontalBarChart Component", () => {
  const defaultProps = {
    themeIndex: 1,
    labelsArray: ["Home Decor", "Electronics", "Gym"],
    dataArray: [10, 21, 23],
    dataLabel: "Dataset",
    titleName: "Number of items per category",
  };

  it("renders correctly with default props", () => {
    cy.mount(<HorizontalBarChart {...defaultProps} />);
    cy.get("canvas").should("be.visible");  // Chart.js renders a <canvas> element

    // Additional checks can include verifying the chart has the right number of bars,
    // checking for correct labels and titles, or even checking the style of the bars if necessary.
    cy.get(".chartjs-render-monitor").should("exist");  // Specific class used by Chart.js
  });

  // More tests can be added here to cover different themes, prop combinations, etc.
});
