const Client = require('./clientsSchema');
const mongoose = require('mongoose');
const NotFoundException = require('../../exception/NotFoundException');
const BadRequestException = require('../../exception/BadRequestException');

//Campi modificabili 
const ALLOWED_CLIENT_FIELDS = [
  'name', 
  'email', 
  'phone', 
  'company', 
  'address', 
  'status', 
  'notes'
];

// Helper interno per estrarre solo i campi autorizzati
const sanitizeClientInput = (inputData) => {
  const sanitized = {};
  ALLOWED_CLIENT_FIELDS.forEach((field) => {
    if (inputData[field] !== undefined) {
      sanitized[field] = inputData[field];
    }
  });
  return sanitized;
};

const getAllClients = async (userId, query = {}) => {
  const filter = { userId };
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { company: { $regex: query.search, $options: 'i' } },
    ];
  }
  return await Client.find(filter);
};

const createClient = async (clientData, userId) => {
  try {
    
    const sanitizedData = sanitizeClientInput(clientData);
    const client = new Client({ ...sanitizedData, userId });
    return await client.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new BadRequestException('A customer with this email is already registered..');
    }
    throw err;
  }
};

const updateClient = async (clientId, updateData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new BadRequestException('Invalid client ID format.');
  }

  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) {
    throw new NotFoundException('Client not found or not authorized.');
  }

  const sanitizedData = sanitizeClientInput(updateData);

  if (Object.keys(sanitizedData).length === 0) {
    throw new BadRequestException('No valid fields provided for update.');
  }

  Object.assign(client, sanitizedData);

  try {
    return await client.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new BadRequestException('The email address entered is already associated with another customer..');
    }
    throw err;
  }
};

const deleteClient = async (clientId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new BadRequestException('Invalid client ID format.');
  }

  const client = await Client.findOneAndDelete({ _id: clientId, userId });
  if (!client) {
    throw new NotFoundException('Client not found or not authorized.');
  }
  return client;
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
};