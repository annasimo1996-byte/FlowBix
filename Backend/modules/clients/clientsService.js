const Client = require('./clientsSchema');
const NotFoundException = require('../../exception/NotFoundException');
const BadRequestException = require('../../exception/BadRequestException');

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
    //Controlla che l'email non appartenga ad un altro cliente dello stesso utente
    if (clientData.email) {
        const existingClient = await Client.findOne({ userId, email: clientData.email });
        if (existingClient) {
            throw new BadRequestException('A customer with this email is already registered..');
        }
    }

    const client = new Client({ ...clientData, userId });
    return await client.save();
};

const updateClient = async (clientId, updateData, userId) => {
    const client = await Client.findOne({ _id: clientId, userId });
    if (!client) {
        throw new NotFoundException('Client not found or not authorized.');
    }

    //Se modifica l'email controlla che non appartenga ad un altro cliente dello stesso utente
    if (updateData.email && updateData.email !== client.email) {
        const emailConflict = await Client.findOne({ userId, email: updateData.email });
        if (emailConflict) {
            throw new BadRequestException('The email address entered is already associated with another customer..');
        }
    }

    Object.assign(client, updateData);
    return await client.save();
};

const deleteClient = async (clientId, userId) => {
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