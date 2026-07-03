const userService = require("./usersService.js");
const { NotFoundException, BadRequestException } = require("../../exceptions/customExceptions.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("This email is already registered");
    }

    const newUser = await userService.createUser({ firstName, lastName, email, password });
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    
    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
    
    return res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};