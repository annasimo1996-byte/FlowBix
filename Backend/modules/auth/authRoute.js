const express = require("express");
const authRouter = express.Router();
const { register, login, forgotPassword, resetPassword } = require("./authControllers.js");

//Registrazione
authRouter.post("/register", register);

//Login
authRouter.post("/login", login);

//Richiesta di reset (genera il token)
authRouter.post("/forgot-password", forgotPassword);

//Reset effettivo (riceve il token nell'URL e la nuova password nel body)
authRouter.post("/reset-password/:token", resetPassword);

module.exports = authRouter;