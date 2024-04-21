const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");

function createApp(dbUri) {
  const app = express();
	let connection = process.env.MONGO_STRING;
	if (dbUri != undefined) {
		connection = dbUri;
	}

	console.log("PRINTING" + dbUri);

  // Set up mongoose connection
  mongoose.set("strictQuery", false);
  mongoose.connect(connection).catch((err) => console.log(err));

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use("/", indexRouter);

  return app;
}

// Default app instance for regular server startup
const app = createApp(process.env.MONGO_STRING);

module.exports = createApp; // Export the factory function for testing or other purposes
module.exports.app = app; // Export the default app instance for regular usage

