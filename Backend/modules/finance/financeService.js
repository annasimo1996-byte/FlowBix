const Finance = require('./financeSchema.js');

const getMovements = async (userId, filters = {}) => {
    const query = { userId };

    // Filtro per tipo
    if (filters.type) {
        query.type = filters.type;
    }

    // Filtro per range di date
    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    return await Finance.find(query).sort({ date: -1 });
};

const createMovement = async (movementData) => {
    const newMovement = new Finance(movementData);
    return await newMovement.save();
};

const updateMovement = async (movementId, userId, updateData) => {
    return await Finance.findOneAndUpdate(
        { _id: movementId, userId },
        updateData,
        { returnDocument: 'after', runValidators: true }
    );
};

const deleteMovement = async (movementId, userId) => {
    return await Finance.findOneAndDelete({ _id: movementId, userId });
};

module.exports = {
    getMovements,
    createMovement,
    updateMovement,
    deleteMovement
};