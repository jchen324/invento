beforeEach(() => {
    // Reset the database before each test
    const path = require('path');
    const scriptPath = path.join(__dirname, '../../../server/populatedb.js');
    cy.exec(`node ${scriptPath}`);

    // cy.exec('node ../../../server/populatedb.js');
  });

describe('Categories Page Tests', () => {

    it('should display all categories', () => {
        // Define the URL of your Categories page
        cy.visit('http://localhost:3000/categories');
        
        // Add an assertion to check for the visibility of all expected categories
        // Update the '.category-name' selector to match your HTML
        const expectedCategories = ['Books', 'Clothing', 'Electronics', 'Furniture', 'Groceries', 'Home Decor', 'Sports Equipment', 'Tools', 'Toys'];
        expectedCategories.forEach(category => {
            cy.get('tbody').find('tr').contains('td', category).should('be.visible');
        });
    });
});

describe('Categories Page Tests', () => {
    it('should be able to edit a category and see the changes', () => {
      // Step 1: Visit the Categories page
      cy.visit('http://localhost:3000/categories'); // Modify this if your base URL is different
      
      // Step 2: Find and click the Edit button for the specific category
      // This step depends on how your Edit button is represented in the DOM
      // For example, if you have an edit button with a unique data-id attribute
      cy.contains('tr', 'Books').find('button.mantine-Button-root').eq(0).click();


      // Step 3: Make the Edit
      // Let’s say you want to change the category name, 
      // you will need to select the input and type the new name
      // Assuming input has a name or id attribute that can be targeted
      cy.get('input[placeholder="Science"]') // This is based on the placeholder shown in the screenshot
      .clear()
      .type('Book');

  
      // Submit the form - this could be clicking a Save button or whatever triggers the save in your app
      cy.get('button[type="submit"]').click();
  
      // Step 4: Verify the Change on the Categories Page
      // Assuming that after the form submission you are redirected back to the Categories page
      // You might need to adjust this if your application behaves differently
      cy.contains('tr', 'Book').should('exist');
    });
  });
  

//   describe('Delete Category Test', () => {
//     it('should be able to delete a category and verify the deletion', () => {
//       // Step 1: Visit the Categories page
//       cy.visit('http://localhost:3000/categories');
  
//       // Step 2: Find the Delete button for a specific category
//       // Replace 'Category Name' with the actual name of the category you wish to delete
//       // and ensure that the selector used here targets the delete button uniquely.
//       cy.contains('tr', 'Clothing').within(() => {
//         cy.get('button').contains('Delete').click();
//       });
  
//       // Step 3: Handle any confirmation if necessary
//       // This step depends on the implementation of your delete functionality.
//       // If there's a confirmation dialog, handle it here. For example:
//       cy.get('button').contains('Confirm Delete').click();
  
//       // Step 4: Verify the category is no longer present
//       // Ensure the category has been removed from the list. For example:
//       cy.contains('Category Name').should('not.exist');
//     });
//   });
  


  
g