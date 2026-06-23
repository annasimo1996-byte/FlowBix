const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./usersControllers.js");

// Rotte per il percorso base / 
usersRouter.get("/", getAllUsers);
usersRouter.post("/", createUser);

// Rotte per i percorsi con ID specifico 
usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;