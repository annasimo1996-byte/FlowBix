const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      lowercase: true, 
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
    collection: "users" 
  }
);

module.exports = mongoose.model("User", userSchema);