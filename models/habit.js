const mongoose = require("mongoose");

//creating schema for habit data
const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// exporting schema for working
const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;
