const Client = require("./clientsSchema.js");

const getAllClientsByUserId = async (userId) => {
  return await Client.find({ userId }).sort({ createdAt: -1 });
};

const createClient = async (clientData) => {
  const newClient = new Client(clientData);
  return await newClient.save();
};

const getClientById = async (clientId) => {
  return await Client.findById(clientId);
};

const deleteClientById = async (clientId) => {
  return await Client.findByIdAndDelete(clientId);
};

module.exports = {
  getAllClientsByUserId,
  createClient,
  getClientById,
  deleteClientById
};