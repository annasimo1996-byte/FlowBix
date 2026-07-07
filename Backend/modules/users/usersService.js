const User = require("./usersSchema.js");

const findUsers = async () => {
  return await User.find().select("-password");
};

const findUserById = async (id) => {
  return await User.findById(id).select("-password");
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
  return await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).select("-password");
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};