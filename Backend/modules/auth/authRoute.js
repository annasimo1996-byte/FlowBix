const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const { register, login, oauthCallback } = require("./authControllers.js");
require("../../config/passport.js");

//Registrazione
authRouter.post("/register", register);
//Login
authRouter.post("/login", login);


//ROTTE GOOGLE 
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), oauthCallback);

//ROTTE GITHUB
authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
authRouter.get("/github/callback", passport.authenticate("github", { session: false }), oauthCallback);

module.exports = authRouter;