const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    tokenVersion: {
      type: Number,
      default: 0,
      select: false, 
    },
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
      select: false, 
      required: function () {
        return !this.googleId && !this.githubId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false, 
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      select: false, 
    },
    resetPasswordToken: {
      type: String,
      select: false, 
    },
    resetPasswordExpires: {
      type: Date,
      select: false, 
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Metodo Helper per serializzare l'utente per il Frontend
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    createdAt: this.createdAt,
    providers: {
      google: Boolean(this.googleId),
      github: Boolean(this.githubId),
    },
  };
};

module.exports = mongoose.model("User", userSchema);