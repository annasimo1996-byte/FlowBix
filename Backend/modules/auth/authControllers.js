const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../users/usersService.js");

// Importiamo le eccezioni personalizzate
const BadRequestException = require("../../exception/BadRequestException.js");
const NotFoundException = require("../../exception/NotFoundException");

// REGISTRAZIONE UTENTE
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Controllo campi obbligatori di base
    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException("All fields (firstName, lastName, email, password) are required");
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException("This email's already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET || "super_secret_key_backup",
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

// RICHIESTA DI RECUPERO PASSWORD
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestException("Email is required");
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException("No user found with this email");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    res.status(200).json({
      message: "Reset token successfully generated!",
      resetToken, 
    });
  } catch (error) {
    next(error);
  }
};

// RECUPERO PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new BadRequestException("New password is required");
    }

    const User = require("../users/usersSchema.js"); 
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestException("The reset token is invalid or expired");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully! You can now log in." });
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
        email: req.user.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Social authentication completed successfully!",
      token,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  oauthCallback,
};