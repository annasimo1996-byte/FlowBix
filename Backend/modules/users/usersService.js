const User = require("./usersSchema.js");
const mongoose = require("mongoose");
const BadRequestException = require("../../exception/BadRequestException");
const NotFoundException = require("../../exception/NotFoundException");

const findUsers = async () => {
  return await User.find();
};

const findUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid user ID format.");
  }
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundException("User not found.");
  }
  return user;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password +googleId +githubId");
};

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const updateUser = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid user ID format.");
  }

  //Restrizioni nell'aggiornamento dei campi
  const allowedUpdates = {};
  const allowedFields = ["firstName", "lastName", "email", "avatarUrl"];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      allowedUpdates[field] = updateData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    id,
    allowedUpdates, 
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedUser) {
    throw new NotFoundException("User not found.");
  }
  return updatedUser;
};

const deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid user ID format.");
  }
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new NotFoundException("User not found.");
  }
  return deletedUser;
};

module.exports = {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};