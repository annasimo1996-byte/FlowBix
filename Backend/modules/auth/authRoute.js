const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const { register, login, forgotPassword, resetPassword, oauthCallback } = require("./authControllers.js");
const { validateRegister } = require("../../middlewares/validation/validation.js");
require("../../config/passport.js");


authRouter.post("/register", validateRegister, register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

// Google 
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), oauthCallback);

// GitHub 
authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
authRouter.get("/github/callback", passport.authenticate("github", { session: false }), oauthCallback);

module.exports = authRouter;