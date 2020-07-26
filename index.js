const express = require("express");
const path = require("path");
const app = express();
const port = 5500;

//require db config and models
const db = require("./config/mongoose");
const Habit = require("./models/habit");
const Record = require("./models/record");
const User = require("./models/user");

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.urlencoded());
app.use(express.static("assets"));

//get request for users page
app.get("/", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in fetching users from db");
      return;
    }

    return res.render("user", {
      title: "Habit Tracker",
      user_list: users,
    });
  });
});

//post request for creating user
app.post("/create-user", (req, res) => {
  User.create(
    {
      username: req.body.name,
    },
    (err, newUser) => {
      if (err) {
        console.log("Error creating user!");
        return;
      }
      console.log("New User : ", newUser);
      return res.redirect("back");
    }
  );
});

//get request for deleting user
app.get("/delete-user", (req, res) => {
  let id = req.query.id;
  User.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log("Error in deleting the contact!");
      return;
    }

    Habit.findOne({ user: id }, (err, habits) => {
      if (err) {
        console.log("Error fetching habit");
        return res.redirect("back");
      }
      if (habits) {
        Record.deleteMany({ habit: habits._id }, (err) => {
          if (err) {
            console.log("Error in deleting the record!");
            return;
          }
        });
      }
    });

    Habit.deleteMany({ user: id }, (err, habits) => {
      if (err) {
        console.log("Error in deleting the contact!");
        return;
      }
      console.log("User Deleted!!");
      return res.redirect("back");
    });
  });
});

//get request for homepage with list of habits
app.get("/render-habits", (req, res) => {
  let id = req.query.id;
  Habit.find({ user: id }, (err, habits) => {
    if (err) {
      console.log("Error in fetching habits from db");
      return;
    }
    return res.render("home", {
      title: "Habit Tracker",
      habit_list: habits,
      user_id: id,
    });
  });
});

//post request for adding new habit
app.post("/create-habit", async (req, res) => {
  let id = req.query.id;
  console.log("user id:", id);
  await Habit.create(
    {
      name: req.body.name,
      user: id,
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

//get request for deleting habit
app.get("/delete-habit", (req, res) => {
  let id = req.query.id;
  Habit.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log("Error in deleting the contact!");
      return;
    }

    Record.deleteMany({ habit: id }, (err) => {
      if (err) {
        console.log("Error in deleting the record!");
      }
      console.log("Habit Deleted!");
      return res.redirect("back");
    });
  });
});

//get request for marking habit as favorite
app.get("/add-favorite", (req, res) => {
  let id = req.query.id;
  Habit.findById(id, (err, habit) => {
    if (err) {
      console.log("Error updating favorites!");
      return;
    }

    habit.favorite = habit.favorite ? false : true;
    habit.save();
    console.log(`Favorite for ${habit.name} set to ${habit.favorite}`);
    return res.redirect("back");
  });
});

//get request for rendering 7 days record associated with each habit
app.get("/render-record", async (req, res) => {
  let weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let id = req.query.id;
  let d = new Date();
  let i = 6;
  d.setDate(d.getDate() - i);

  //traverse through already associated record
  while (i >= 0) {
    let recordExists = await Record.exists({
      date: d.toISOString().slice(0, 10),
      habit: id,
    });

    if (recordExists) {
      // console.log(d.toISOString().slice(0, 10), weekDays[d.getDay()]);
      d = new Date();
      i--;
      d.setDate(d.getDate() - i);
    } else {
      break;
    }
  }

  //delete all past records that are not required to display
  let delIndex = i;
  while (delIndex >= 0) {
    await Record.findOneAndDelete(
      { day: weekDays[d.getDay()], habit: id },
      (err) => {
        if (err) {
          console.log("Error deleting past days!");
        }
      }
    );
    d = new Date();
    delIndex--;
    d.setDate(d.getDate() - delIndex);
  }

  //create records for latest days that doesn't exist in db
  d = new Date();
  d.setDate(d.getDate() - i);
  while (i >= 0) {
    let newRecord = await Record.create({
      date: d.toISOString().slice(0, 10),
      day: weekDays[d.getDay()],
      habit: id,
    });
    console.log("New Record:", newRecord);
    i--;
    d = new Date();
    d.setDate(d.getDate() - i);
  }

  //render 7 days records
  await Habit.findById(id, (err, habit) => {
    Record.find({ habit: id }, (err, records) => {
      if (err) {
        console.log("Error in fetching records from db");
        return;
      }
      return res.render("view_record", {
        title: "Habit Tracker",
        record_list: records,
        habitDetails: habit,
      });
    });
  });
});

//get method for marking each day habit as 'done', 'not-done' or none
app.get("/mark-done", async (req, res) => {
  let id = req.query.id;
  await Record.findById(id, (err, record) => {
    if (err) {
      console.log("Error updating record!!");
      return;
    }

    if (record.done === "none") {
      record.done = "done";
    } else if (record.done === "done") {
      record.done = "not-done";
    } else {
      record.done = "none";
    }
    record.save();
    return res.redirect("back");
  });
});

//running the express server on port
app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }

  console.log(`Server is up and running on port : ${port}`);
});
