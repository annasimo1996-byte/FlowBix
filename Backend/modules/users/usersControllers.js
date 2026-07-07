const userService = require("./usersService.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.findUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli utenti", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dell'utente", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Questa email è già registrata" });
    }

    const newUser = await userService.createUser({ firstName, lastName, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nella creazione dell'utente", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento dell'utente", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json({ message: "Utente eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione dell'utente", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};