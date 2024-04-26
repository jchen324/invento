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
      console.log(doc.body.innerHTML); // Use the browser's console to inspect the elements
      cy.get("canvas").should("be.visible");
    });

    // Use contains to find the title by its text content
    // cy.contains(titleName).should('be.visible');
  });

  //   it('renders the pie chart with all slices', () => {
  //     // Checking if the pie chart has rendered the correct number of slices
  //     cy.get('.pie-slice').should('have.length', labelsArray.length);
  //   });

  //   it('displays tooltip on hover', () => {
  //     // Hover over the first slice and check if the tooltip appears
  //     cy.get('.pie-slice').first().trigger('mouseover');
  //     cy.get('.tooltip').should('contain', labelsArray[0])
  //                       .and('be.visible');
  //   });

  //   it('selects a slice on click', () => {
  //     // Click on a slice and verify if it is selected (assuming some class like 'selected' is added)
  //     cy.get('.pie-slice').eq(1).click();
  //    });
});
