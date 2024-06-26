#! /usr/bin/env node

/**
 * This script populates some items and categories to your database.
 * ! A .env file must be present in server folder and it must contain your mongo connection string
 *
 */

require("dotenv").config();

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(process.env.MONGO_STRING);
  console.log("Debug: Should be connected?");
  // ! Categories must be created first before item depend on category
  await clearDatabase(); 
  console.log('Database cleared.');
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added genre: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  status,
  stock,
  price,
  category,
  image = false
) {
  const item_ = {
    name: name,
    description: description,
    status: status,
    stock: stock,
    price: price,
    category: category,
  };
  if (image != false) item_.image = image;

  const item = new Item(item_);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "Devices and gadgets that operate through electronic systems"
    ),
    categoryCreate(
      1,
      "Clothing",
      "Various types of apparel for men, women, and children"
    ),
    categoryCreate(
      2,
      "Groceries",
      "Food and household items for daily consumption"
    ),
    categoryCreate(
      3,
      "Books",
      "Printed and digital reading materials, including novels, textbooks, and more"
    ),
    categoryCreate(
      4,
      "Home Decor",
      "Items used to decorate and enhance the aesthetic appeal of homes"
    ),
    categoryCreate(
      5,
      "Toys",
      "Playthings for children that promote entertainment and learning"
    ),
    categoryCreate(
      6,
      "Furniture",
      "Various types of movable objects intended to support various human activities"
    ),
    categoryCreate(
      7,
      "Tools",
      "Instruments used to carry out particular functions or tasks"
    ),
    categoryCreate(
      8,
      "Sports Equipment",
      "Gear and accessories used in various sports and recreational activities"
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Smartphone",
      "A high-end smartphone with advanced features",
      "Available",
      20,
      899.99,
      categories[0]
    ),
    itemCreate(
      1,
      "T-shirt",
      "A comfortable cotton T-shirt",
      "Available",
      50,
      25.99,
      categories[1]
    ),
    itemCreate(
      2,
      "Milk",
      "Fresh cow milk",
      "Available",
      100,
      2.99,
      categories[2]
    ),
    itemCreate(
      3,
      "The Great Gatsby",
      "A classic novel by F. Scott Fitzgerald",
      "Available",
      30,
      12.49,
      categories[3]
    ),
    itemCreate(
      4,
      "Decorative Vase",
      "A handcrafted decorative vase",
      "Available",
      15,
      69.99,
      categories[4]
    ),
    itemCreate(
      5,
      "Lego Set",
      "A creative Lego building set for kids",
      "Available",
      40,
      49.99,
      categories[5]
    ),
    itemCreate(
      6,
      "Sofa",
      "A comfortable 3-seater sofa",
      "Available",
      5,
      599.99,
      categories[6]
    ),
    itemCreate(
      7,
      "Hammer",
      "A sturdy hammer for household repairs",
      "Available",
      25,
      9.99,
      categories[7]
    ),
    itemCreate(
      7,
      "Screwdriver",
      "A sturdy screwdriver for household repairs",
      "Available",
      25,
      19.99,
      categories[7]
    ),
    itemCreate(
      7,
      "Gorilla Glue",
      "A sticky glue for household repairs",
      "Reserved",
      25,
      29.99,
      categories[7]
    ),
    itemCreate(
      8,
      "Yoga Mat",
      "A high-quality yoga mat for exercise",
      "Available",
      30,
      29.99,
      categories[8]
    ),
    itemCreate(
      8,
      "5kg Dumbell",
      "A high-quality dumbell for exercise",
      "Reserved",
      130,
      129.99,
      categories[8]
    ),
    itemCreate(
      0,
      "Headphones",
      "High-quality over-ear headphones with noise-cancellation feature",
      "Loaned",
      15,
      199.99,
      categories[0]
    ),
    itemCreate(
      1,
      "Dress Shirt",
      "A formal dress shirt made of premium cotton fabric",
      "Available",
      30,
      49.99,
      categories[1]
    ),
    itemCreate(
      2,
      "Apples",
      "Fresh, organic apples from local farms",
      "Available",
      200,
      1.99,
      categories[2]
    ),
    itemCreate(
      3,
      "The Catcher in the Rye",
      "A popular novel by J.D. Salinger",
      "Available",
      20,
      9.99,
      categories[3]
    ),
    itemCreate(
      4,
      "Wall Clock",
      "A vintage-style wall clock with a silent mechanism",
      "Loaned",
      8,
      39.99,
      categories[4]
    ),
    itemCreate(
      5,
      "Remote Control Car",
      "A battery-powered remote control car for kids",
      "Available",
      25,
      34.99,
      categories[5]
    ),
    itemCreate(
      6,
      "Dining Table",
      "A sturdy wooden dining table with six chairs",
      "Maintenance",
      3,
      799.99,
      categories[6]
    ),
    itemCreate(
      7,
      "Screwdriver Set",
      "A set of screwdrivers with various tip sizes for household use",
      "Maintenance",
      0,
      19.99,
      categories[7]
    ),
    itemCreate(
      8,
      "Yoga Ball",
      "A durable yoga ball for core strengthening exercises",
      "Maintenance",
      20,
      19.99,
      categories[8]
    ),
  ]);
}
