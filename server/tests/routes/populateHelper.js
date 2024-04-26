const Category = require("../../models/category");
const Item = require("../../models/item");

async function clearDatabase() {
  await Category.deleteMany({});
  await Item.deleteMany({});
}

async function createCategories() {
  // Define categories with their descriptions
  const categoriesData = [
    {
      name: "Electronics",
      description:
        "Devices and gadgets that operate through electronic systems",
    },
    {
      name: "Clothing",
      description: "Various types of apparel for men, women, and children",
    },
    {
      name: "Groceries",
      description: "Food and household items for daily consumption",
    },
    {
      name: "Home Decor",
      description:
        "Items used to decorate and enhance the aesthetic appeal of homes",
    },
  ];

  // Save categories to database and return them
  const categories = await Category.insertMany(categoriesData);
  return categories;
}

async function createItems(categories) {
  // Map categories to their IDs for reference in items
  const categoryMap = categories.reduce((map, category) => {
    map[category.name] = category._id;
    return map;
  }, {});

  // Define items with references to category IDs
  const itemsData = [
    {
      name: "Smartphone",
      description: "A high-end smartphone",
      category: categoryMap["Electronics"],
      status: "Reserved",
      stock: 20,
      price: 999.99,
    },
    {
      name: "Jeans",
      description: "Comfortable blue jeans",
      category: categoryMap["Clothing"],
      status: "Loaned",
      stock: 50,
      price: 49.99,
    },
    {
      name: "Milk",
      description: "A carton of fresh milk",
      category: categoryMap["Groceries"],
      status: "Available",
      stock: 100,
      price: 2.99,
    },
    {
      name: "Table",
      description: "A sturdy wooden table",
      category: categoryMap["Home Decor"],
      status: "Available",
      stock: 10,
      price: 199.99,
    },
  ];

  // Save items to database
  await Item.insertMany(itemsData);
}

module.exports = {
  createCategories,
  createItems,
  clearDatabase,
};
