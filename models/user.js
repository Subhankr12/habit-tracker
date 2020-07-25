const mongoose = require("mongoose");

//create user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// export user schema
const User = mongoose.model("User", userSchema);
module.exports = User;
