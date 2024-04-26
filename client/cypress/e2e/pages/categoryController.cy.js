beforeEach(() => {
    // Reset the database before each test
    const path = require('path');
    const scriptPath = path.join(__dirname, '../../../../server/populatedb.js');
    cy.exec(`node ${scriptPath}`);

    // cy.exec('node ../../../server/populatedb.js');
  });

describe('Categories Page Tests', () => {
    it('should display all categories', () => {
        // Intercept the GET request to '/categories'
        cy.intercept('GET', '/categories').as('getCategories');
    
        // Visit the Categories page
        cy.visit('http://localhost:3000/categories');
        
        // Wait for the '/categories' GET request to complete
        cy.wait('@getCategories');
    
        // Add an assertion to check for the visibility of all expected categories
        // Update the '.category-name' selector to match your HTML
        const expectedCategories = ['Books', 'Clothing', 'Electronics', 'Furniture', 'Groceries', 'Home Decor', 'Sports Equipment', 'Tools', 'Toys'];
        expectedCategories.forEach(category => {
          cy.get('tbody').find('tr').contains('td', category).should('be.visible');
        });
      });
    
    it('can edit a category without saving changes', () => {
            // Mock the update category request
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
        
            // Wait for the mock POST request to complete
            cy.wait('@updateCategory').its('request.body').should('include', {
              name: 'Book',
            });
        
            // Optionally verify that the UI updates to reflect the change
            // This depends on whether your app optimistically updates the UI
            cy.contains('tr', 'Book').should('exist');
          });
    it('should be able to delete a category and verify the deletion without actual deletion', () => {
      // Intercept the DELETE request
      cy.intercept('POST', '**/category/**/delete', {
        statusCode: 200
      }).as('deleteCategory');
        
      // Visit the Categories page
      cy.visit('http://localhost:3000/categories');
        
      // Find the Delete button for the category and click it
      cy.contains('tr', 'Books').within(() => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('1234');
      });
      cy.get('button').contains('Delete').click();
    });
    cy.wait('@deleteCategory');

    cy.get('@deleteCategory').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    });
});




  
  



  
