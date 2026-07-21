const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../users/usersService.js");

const BadRequestException = require("../../exception/BadRequestException.js");
const NotFoundException = require("../../exception/NotFoundException");

// REGISTRAZIONE UTENTE
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException("All fields (firstName, lastName, email, password) are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new BadRequestException("Please provide a valid email address");
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("This email's already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    try {
      newUser = await userService.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        throw new BadRequestException("This email's already registered");
      }
      throw dbError;
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN UTENTE
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    if (!user.password) {
      throw new BadRequestException("This account uses social login. Please sign in with Google or GitHub.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// CALLBACK PER OAUTH (GOOGLE & GITHUB)
const oauthCallback = (req, res, next) => {
  try {
    if (!req.user) {
      throw new BadRequestException("Social login failed");
    }

    const token = jwt.sign(
      {
        id: req.user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Reindirizzamento al frontend passando il token nella query string
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  oauthCallback,
};