import React from "react";
import TableSort from "../../components/TableSort";
import { wrapWithProviders } from "../support/wrapWithProviders";

describe("TableSort Component", () => {
  const initialData = [
    { _id: "1", name: "Electronics", description: "Gadgets and more" },
    { _id: "2", name: "Books", description: "Read and enjoy" },
  ];

  beforeEach(() => {
    const deleteHandler = cy.stub().resolves();
    cy.mount(
      wrapWithProviders(
        <TableSort data={initialData} deleteHandler={deleteHandler} />
      )
    );
  });

  it("renders correctly with initial data", () => {
    cy.get("table")
      .find("tr")
      .should("have.length", initialData.length + 2); // Including header and create new button row
  });
});
