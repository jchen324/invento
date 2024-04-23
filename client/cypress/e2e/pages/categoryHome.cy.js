describe('Home Page Update After Edit', () => {
    it('updates the charts and lists on the Home page after an item is edited', () => {
      // Intercept the API call that fetches category data
      cy.intercept('GET', '/items/grouped-by-category').as('getItemsByCategory');
  
      // Intercept the API call that fetches the latest items
      cy.intercept('GET', '/items/recent/*').as('getRecentItems');
  
      // Perform the edit operation (navigating and editing an item)
      cy.visit('http://localhost:3000/items');
      cy.intercept("POST", "**/item/**/update", { statusCode: 200 }).as(
        "updateItem"
      );
  
      cy.contains("Hammer").click();
      cy.contains("9.99").should("be.visible"); // Ensure the page or component has loaded and displays the price $9.99
      cy.get(".tabler-icon-edit").click();
      cy.url().should("include", "/edit");
      cy.contains("label", "Price").next().children("input").clear().type("10");
      cy.contains("button", "Submit").click();
  
  
      // Navigate back to the Home page
      cy.visit('http://localhost:3000');
  
      // Wait for the API calls to complete to ensure the page has fresh data
      cy.wait(['@getItemsByCategory', '@getRecentItems']);
  
      // Verify the Home page reflects the updated data
      // For example, check that the count for a category has increased/decreased
      // or that the 'Latest items' list includes the newly edited item
      // ...
    });

    it('updates the charts and lists on the Home page after an item is deleted', () => {
        // Intercept the API call that fetches category data
        cy.intercept('GET', '/items/grouped-by-category').as('getItemsByCategory');
    
        // Intercept the API call that fetches the latest items
        cy.intercept('GET', '/items/recent/*').as('getRecentItems');
    
        // Perform the delete operation (clicking the delete button and confirming)
        // ...
        cy.visit('http://localhost:3000/items');

        cy.intercept('DELETE', '/item/**', {
            statusCode: 200,
            body: { /* your mock response body if needed */ },
          }).as('deleteItem');
      

        cy.contains("Smartphone").click();
        cy.contains("button", "Delete").click();
        cy.on('window:confirm', () => true);

    
        // Navigate back to the Home page   
        cy.visit('http://localhost:3000');
    
        // Wait for the API calls to complete to ensure the page has fresh data
        cy.wait(['@getItemsByCategory', '@getRecentItems']);
        cy.on('window:confirm', () => true);
    
        // Verify the Home page reflects the updated data
        // For example, check that the count for a category has decreased
        // or that the 'Latest items' list no longer includes the deleted item
        // ...
      });
  });
  