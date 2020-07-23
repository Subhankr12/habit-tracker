const express = require("express");
const path = require("path");
const app = express();
const port = 5500;

const db = require("./config/mongoose");
const Habit = require("./models/habit");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));

app.get("/", (req, res) => {
  Habit.find({}, (err, habits) => {
    if (err) {
      console.log("Error in fetching habits from db");
      return;
    }
    return res.render("home", {
      title: "Habit Tracker",
      habit_list: habits,
    });
  });
});

app.post("/create-habit", (req, res) => {
  Habit.create(
    {
      name: req.body.name,
    },
    (err, newHabit) => {
      if (err) {
        console.log("Error creating habit!");
        return;
      }
      console.log("New Habit : ", newHabit);
      return res.redirect("back");
    }
  );
});

app.get("/delete-habit", (req, res) => {
  let id = req.query.id;
  Habit.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log("Error in deleting the contact!");
      return;
    }

    return res.redirect("back");
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }

  console.log(`Server is up and running on port : ${port}`);
});
