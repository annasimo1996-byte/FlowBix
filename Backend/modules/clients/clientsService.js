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

const updateClientById = async (clientId, updateData) => {
  return await Client.findByIdAndUpdate(
    clientId,
    updateData,
    { new: true, runValidators: true }
  );
};

module.exports = {
  getAllClientsByUserId,
  createClient,
  getClientById,
  deleteClientById,
  updateClientById
};