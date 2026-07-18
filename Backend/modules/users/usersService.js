const User = require("./usersSchema.js");
const mongoose = require("mongoose");
const BadRequestException = require("../../exception/BadRequestException");
const NotFoundException = require("../../exception/NotFoundException");

const findUsers = async () => {
  return await User.find().select("-password");
};

const findUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid user ID format.");
  }
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new NotFoundException("User not found.");
  }
  return user;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  
  const userResponse = newUser.toObject();
  delete userResponse.password;
  return userResponse;
};

const updateUser = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Invalid user ID format.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    { returnDocument: 'after', runValidators: true }
  ).select("-password");

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