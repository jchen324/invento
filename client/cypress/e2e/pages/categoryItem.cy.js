describe('Item Creation Page Category Dropdown', () => {
    it('shows updated categories after a category has been edited', () => {
      // Intercept the GET request for categories
      cy.intercept('GET', '/categories').as('getCategories');
  
      // Perform the edit operation on the category
      // This would involve visiting the category edit page, changing the category name, and submitting the form
      // ...
  
      // Now visit the item creation page
      cy.visit('http://localhost:3000/edit/item?title=Create+new+item');
  
      // Wait for the categories to be fetched again, which should now include the edited category
      cy.wait('@getCategories');
  
      // Verify that the dropdown includes the updated category
      cy.get('select[name="category"]').should('contain', 'Updated Category Name');
    });
  });
  