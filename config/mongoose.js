const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/habit_tracker_db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", () => {
  console.log("Successfully connected to the database");
});
