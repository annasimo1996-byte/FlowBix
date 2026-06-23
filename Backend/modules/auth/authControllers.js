const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userService = require("../users/usersService.js"); // Recuperiamo il service degli utenti

//REGISTRAZIONE UTENTE CLASSICA
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Questa email è già registrata" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utente registrato con successo!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Errore durante la registrazione", error: error.message });
  }
};

//LOGIN UTENTE CLASSICO
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "super_secret_key_backup",
      { expiresIn: "24h" } 
    );

    res.status(200).json({
      message: "Login effettuato con successo!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il login", error: error.message });
  }
};

//RICHIESTA DI RECUPERO PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Nessun utente trovato con questa email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 ora in millisecondi

    await user.save();

    // NOTA: Qui andrebbe l'invio dell'email reale. 
    // Per ora, simuliamo restituendo il token nella risposta JSON per testarlo su Postman!
    res.status(200).json({
      message: "Token di reset generato con successo. (In produzione verrebbe inviato via email)",
      resetToken, 
    });
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero password", error: error.message });
  }
};

//RECUPERO PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const User = require("../users/usersSchema.js"); 
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Il token di reset è invalido o scaduto" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo! Ora puoi effettuare il login." });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il reset della password", error: error.message });
  }
};

// 5. CALLBACK PER OAUTH (GOOGLE & GITHUB)
const oauthCallback = (req, res) => {
  try {
    // Passport inserisce l'utente autenticato dentro req.user
    if (!req.user) {
      return res.status(400).json({ message: "Autenticazione social fallita" });
    }

    // Generiamo il token JWT per l'utente social
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // In produzione, di solito si reindirizza al frontend passando il token nella query string:
    // res.redirect(`http://localhost:5173/login-success?token=${token}`);
    
    // Per adesso che testiamo il backend, restituiamo un JSON di successo
    res.status(200).json({
      message: "Autenticazione Social completata con successo!",
      token,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il callback OAuth", error: error.message });
  }
};

module.exports = {
 register,
  login,
  forgotPassword,
  resetPassword,
  oauthCallback,
};