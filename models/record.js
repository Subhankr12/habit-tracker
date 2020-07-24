const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    day: {
      type: String,
    },
    done: {
      type: String,
      default: "none",
    },
    habit: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
