const bcrypt = require("bcryptjs");
const userService = require("./usersService.js");

const BadRequestException = require("../../exception/BadRequestException");
const NotFoundException = require("../../exception/NotFoundException");
const ForbiddenException = require("../../exception/ForbiddenException");

// GET /users - Limitato agli ADMIN
const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenException("Access denied: Admin rights required");
    }
    const users = await userService.findUsers();
    
    // Serializza la lista di utenti
    const publicUsers = users.map((u) => u.toPublicJSON());
    res.status(200).json(publicUsers);
  } catch (error) {
    next(error);
  }
};

// GET /users/:id - Solo se è l'utente proprietario dell'account o un admin
const getUserById = async (req, res, next) => {
  try {
    const isOwner = req.user.id.toString() === req.params.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Access denied: You can only access your own profile");
    }

    const user = await userService.findUserById(req.params.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    res.status(200).json(user.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

// POST /users - Solo per Admin
const createUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenException("Access denied: Admin rights required");
    }

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException("All fields (firstName, lastName, email, password) are required");
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("This email is already registered");
    }

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

    res.status(201).json(newUser.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

// GET /users/me - Profilo dell'utente corrente 
const getMyProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new NotFoundException("User not found!");
    }
   
    res.status(200).json(req.user.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

// PUT /users/:id - Ownership check + Mass Assignment Defense
const updateUser = async (req, res, next) => {
  try {
    const isOwner = req.user.id.toString() === req.params.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Access denied: You can only update your own profile");
    }

    // Estrae solo i campi modificabili dal body
    const { firstName, lastName, email, avatarUrl } = req.body;
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No valid fields provided for update");
    }

    const updatedUser = await userService.updateUser(req.params.id, updateData);
    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    res.status(200).json(updatedUser.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id - Ownership check o Admin
const deleteUser = async (req, res, next) => {
  try {
    const isOwner = req.user.id.toString() === req.params.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Access denied: You can only delete your own profile");
    }

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