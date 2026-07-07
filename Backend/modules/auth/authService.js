const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../users/usersService.js");
const User = require("../users/usersSchema.js");
const { BadRequestException, NotFoundException } = require("../../exceptions/customExceptions.js");

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    throw new BadRequestException("This email is already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await userService.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
};

const loginUser = async ({ email, password }) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new BadRequestException("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestException("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "super_secret_key_backup",
    { expiresIn: "24h" }
  );

  return { token, user };
};

const generateResetToken = async (email) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new NotFoundException("No user found with this email");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save();
  return resetToken;
};

const executePasswordReset = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestException("Reset token is invalid or has expired");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

const generateOAuthToken = (user) => {
  if (!user) {
    throw new BadRequestException("Social authentication failed");
  }

  return jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "super_secret_key_backup",
    { expiresIn: "24h" }
  );
};

module.exports = {
  registerUser,
  loginUser,
  generateResetToken,
  executePasswordReset,
  generateOAuthToken,
};