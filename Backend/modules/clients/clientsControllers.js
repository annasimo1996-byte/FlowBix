const clientsService = require("./clientsService.js");
const { BadRequestException, NotFoundException, ForbiddenException } = require("../../exceptions/customExceptions.js");

const getClients = async (req, res, next) => {
  try {
    const clients = await clientsService.getAllClientsByUserId(req.user._id);
    return res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const addClient = async (req, res, next) => {
  const { name, email, phone, company, notes } = req.body;

  try {
    if (!name || !email) {
      throw new BadRequestException("Name and email are required fields");
    }

    const newClient = await clientsService.createClient({
      userId: req.user._id,
      name,
      email,
      phone,
      company,
      notes
    });
    return res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

const removeClient = async (req, res, next) => {
  try {
    const client = await clientsService.getClientById(req.params.id);

    if (!client) {
      throw new NotFoundException("Client not found");
    }

    // Controllo di sicurezza sulla corrispondenza cliente/utente
    if (client.userId.toString() !== req.user._id.toString()) {
      throw new ForbiddenException("User not authorized to delete this client");
    }

    await clientsService.deleteClientById(req.params.id);
    return res.status(200).json({ message: "Client successfully removed", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, company, email, phone, notes } = req.body;

    const client = await clientsService.getClientById(id);

    if (!client) {
      throw new NotFoundException("Client not found");
    }

    if (client.userId.toString() !== req.user._id.toString()) {
      throw new ForbiddenException("User not authorized to update this client");
    }

    const updatedClient = await clientsService.updateClientById(id, { 
      name, 
      company, 
      email, 
      phone, 
      notes 
    });

    res.status(200).json(updatedClient);
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  getClients,
  addClient,
  removeClient,
  updateClient
};