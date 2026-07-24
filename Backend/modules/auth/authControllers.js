const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../users/usersService.js");

const BadRequestException = require("../../exception/BadRequestException.js");

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
        tokenVersion: 0,
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        throw new BadRequestException("This email's already registered");
      }
      throw dbError;
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.toPublicJSON(), 
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
        id: user._id,
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: user.toPublicJSON(), 
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
        id: req.user._id,
        tokenVersion: req.user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const frontendUrl = process.env.CLIENT_URL;

    // Reindirizzamento al frontend inviando solo il token
    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (error) {
    next(error);
  }
};

// LOGOUT SERVER-SIDE (INVALIDAZIONE TOKEN)
const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new BadRequestException("User not authenticated");
    }
    // Incrementa la tokenVersion dell'utente per invalidare tutti i token attuali
    req.user.tokenVersion = (req.user.tokenVersion || 0) + 1;
    await req.user.save();

    res.status(200).json({
      message: "Logout successfully completed on server.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  oauthCallback,
  logout,
};