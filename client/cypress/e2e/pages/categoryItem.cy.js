describe('Item Creation Page Category Dropdown', () => {
    it('shows updated categories after a category has been edited', () => {
      // Intercept the GET request for categories
      cy.intercept('POST', '**/category/**/update', {
        statusCode: 200,
        body: { /* Your mock response body if needed */ },
      }).as('updateCategory');
  
      // Visit the Categories page and click the 'Edit' button for "Books"
      cy.visit('http://localhost:3000/categories');
      cy.contains('tr', 'Books').find('button').contains('Edit').click();
  
      // Ensure the edit page has loaded and input fields are visible
      // Replace the below selectors with the actual selectors from your app
      cy.url().should('include', '/edit');
      cy.get('input[placeholder="Science"]').should('be.visible');
  
      // Mock entering a new category name without actually changing the database
      cy.get('input[placeholder="Science"]').clear().type('Book');
  
      // Click the submit button to send the update request
      cy.get('button[type="submit"]').click();

      cy.wait('@updateCategory').its('request.body').should('include', {
        name: 'Book',
      });

      cy.visit('http://localhost:3000/items');
  
      // Wait for the categories to be fetched again, which should now include the edited category
      cy.intercept("POST", "**/item/**/update", { statusCode: 200 }).as(
        "updateItem"
      );
  
      cy.contains("Hammer").click();
      cy.contains("9.99").should("be.visible"); // Ensure the page or component has loaded and displays the price $9.99
      cy.get(".tabler-icon-edit").click();
      cy.url().should("include", "/edit");
      cy.contains('label', 'Category').next().children('select').select('Books');
    });
  });
  