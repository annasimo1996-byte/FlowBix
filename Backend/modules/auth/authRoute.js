const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const { protect } = require("../../middlewares/authMiddleware.js");
const { register, login, oauthCallback, logout } = require("./authControllers.js");
require("../../config/passport.js");

//Registrazione
authRouter.post("/register", register);
//Login
authRouter.post("/login", login);


//ROTTE GOOGLE 
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: true,
    }
    ));

authRouter.get("/google/callback", passport.authenticate("google", { session: false,  }), oauthCallback);

//ROTTE GITHUB
authRouter.get("/github",
    passport.authenticate("github", {
        scope: ["user:email"],
        state: true,
    }
));
authRouter.get("/github/callback", passport.authenticate("github", { session: false }), oauthCallback);

authRouter.post("/logout", protect, logout);

module.exports = authRouter;