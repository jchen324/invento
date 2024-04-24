import React from "react";
import { wrapWithProviders } from "../../support/wrapWithProviders";
import HorizontalBarChart from "../../../components/charts/HorizontalBarChart";
import { Item } from "../../../common/types";
import { Chart as ChartJS } from 'chart.js';


describe('HorizontalBarChart Component', () => {

  it('renders correctly with default props', () => {
    cy.mount(wrapWithProviders(<HorizontalBarChart />));
    cy.get('canvas').should('be.visible'); 
    cy.get('canvas[role="img"]').should('be.visible');
    // cy.get("a").contains('Number of items per category').should('be.visible');
  });

  it('updates dataset when props change', () => {
    const newLabels = ['Books', 'Movies', 'Music'];
    const newData = [15, 9, 20];

    cy.mount(wrapWithProviders(<HorizontalBarChart labelsArray={['Books', 'Movies', 'Music']} dataArray={[15, 9, 20]} />));
    cy.get('canvas').should('be.visible');
  });
});

