const express = require("express");
const usersRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const {
  getMyProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./usersControllers.js");

// Profilo utente corrente 
usersRouter.get("/me", protect, getMyProfile);

// Rotte base 
usersRouter.get("/", protect, getAllUsers);
usersRouter.post("/", protect, createUser);

// Rotte per risorsa specifica
usersRouter.get("/:id", protect, getUserById); 
usersRouter.put("/:id", protect, updateUser);
usersRouter.delete("/:id", protect, deleteUser);

module.exports = usersRouter;