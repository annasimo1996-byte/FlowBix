const express = require("express");
const usersRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./usersControllers.js");

// Rotte per il percorso base / 
usersRouter.get("/", protect, getAllUsers);
usersRouter.post("/", createUser);

// Rotte per i percorsi con ID specifico 
usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", protect, updateUser);
usersRouter.delete("/:id", protect, deleteUser);

module.exports = usersRouter;