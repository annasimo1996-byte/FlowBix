const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../users/usersService.js");
const nodemailer = require("nodemailer");
const { getResetPasswordTemplate } = require("../../utils/emailTemplates.js");

const BadRequestException = require("../../exception/BadRequestException.js");
const NotFoundException = require("../../exception/NotFoundException");

// REGISTRAZIONE UTENTE
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id
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
  console.log("-> Ricevuta richiesta forgotPassword per email:", req.body.email);
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestException("Email is required");
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException("No user found with this email");
    }

    //Token casuale che scade in 1h
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    //Configurazione Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //Link per il reset che punta al frontend
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"FlowBix Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - FlowBix",
      html: getResetPasswordTemplate(resetUrl),
    };

    //Invio email 
    console.log("-> Tentativo di invio email con Nodemailer...");
    await transporter.sendMail(mailOptions);
    console.log("-> Email inviata con successo!");

    res.status(200).json({
      message: "Reset link successfully sent to your email!",
    });
  } catch (error) {
    next(error);
  }
};

// RECUPERO PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;// Estrae il token dall'URL
    const { password } = req.body; // Prende la nuova password inviata dal frontend

    if (!password || !token ) {
      throw new BadRequestException("Password is required");
    }

    // 1. Cerca l'utente che ha quel token e controlla che non sia scaduto
    const user = await userService.findUserByResetToken(token);

    if (!user || user.resetPasswordExpires < Date.now()) {
      throw new BadRequestException("The reset token is invalid or has expired.");
    }

    //Hashing della nuova password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully!",
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

    res.status(200).json({
      message: "Social authentication completed successfully!",
      token,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      }
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