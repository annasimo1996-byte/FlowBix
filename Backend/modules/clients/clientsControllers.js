const clientService = require('./clientsService');
const BadRequestException = require('../../exception/BadRequestException');

const getClients = async (req, res, next) => {
  try {
    const clients = await clientService.getAllClients(req.user.id, req.query);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    const newClient = await clientService.createClient(req.body, req.user.id);
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    const updatedClient = await clientService.updateClient(req.params.id, req.body, req.user.id);
    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    await clientService.deleteClient(req.params.id, req.user.id);
    res.status(200).json({ message: 'Customer successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getClients, 
  createClient, 
  updateClient, 
  deleteClient 
};