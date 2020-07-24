//require mongoose
const mongoose = require("mongoose");

//connect to db
mongoose.connect("mongodb://localhost/habit_tracker_db");

//acquire the connection to check if is successful
const db = mongoose.connection;

//check for error
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

//successfully connected
db.once("open", () => {
  console.log("Successfully connected to the database");
});
