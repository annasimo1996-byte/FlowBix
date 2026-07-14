const bcrypt = require("bcryptjs");
const userService = require("./usersService.js");

const BadRequestException = require("../../exception/BadRequestException");
const NotFoundException = require("../../exception/NotFoundException");

//TUTTI GLI UTENTI
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//UN UTENTE PER ID
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//NUOVO UTENTE
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException("All fields (firstName, lastName, email, password) are required");
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("This email is already registered");
    }

    // Applicazione dell'hashing della password per sicurezza
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    try {
      newUser = await userService.createUser({ 
        firstName, 
        lastName, 
        email, 
        password: hashedPassword 
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        throw new BadRequestException("This email is already registered");
      }
      throw dbError;
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

//CONTROLLO DEL TOKEN CORRENTE
const getMyProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundException("User not found!");
    }
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

//AGGIORNA UN UTENTE
const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

//ELIMINA UN UTENTE
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getMyProfile,
  updateUser,
  deleteUser,
};