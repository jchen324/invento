const { Builder, By, Key, until } = require("selenium-webdriver");

(async function example() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Navigate to your local or prod site
    await driver.get("http://localhost:3000/");

    // Check for a specific element that should be present on the home page
    await driver.wait(
      until.elementLocated(By.className("mantine-Title-root")),
      10000
    );

    // Assert title or any other element
    let title = await driver.getTitle();
    console.assert(title === "invento");
  } finally {
    await driver.quit();
  }
})();
