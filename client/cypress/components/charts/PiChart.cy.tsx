import PieChart from "../../../components/charts/PieChart";

describe("PieChart Component Tests", () => {
  const labelsArray = ["Category 1", "Category 2", "Category 3"];
  const dataArray = [10, 20, 30];
  const titleName = "Sales Distribution";

  beforeEach(() => {
    // Mounting the PieChart component with sample props
    cy.mount(
      <PieChart
        labelsArray={labelsArray}
        dataArray={dataArray}
        titleName={titleName}
      />
    );
  });

  it("renders the pie chart with the correct title", () => {
    // Checking if the PieChart renders with the provided title
    cy.document().then((doc) => {
      cy.get("canvas").should("be.visible");

      cy.wait(1000); // Wait for 1 second for the pi chart to fully load

      // Use visual testing to test the content of the pi chart by
      // checking if the pi chart generated is the same as the baseline
      cy.compareSnapshot({
        name: "pi-chart",
        testThreshold: 0.2,
      });
    });
  });
});
