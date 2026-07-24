const Finance = require('./financeSchema.js');
const BadRequestException = require('../../exception/BadRequestException.js');

//Campi modificabili 
const ALLOWED_FINANCE_FIELDS = [
  'amount',
  'type',
  'category',
  'date',
  'description'
];

// Helper per estrarre solo i campi consentiti
const sanitizeFinanceInput = (inputData) => {
  const sanitized = {};
  ALLOWED_FINANCE_FIELDS.forEach((field) => {
    if (inputData[field] !== undefined) {
      sanitized[field] = inputData[field];
    }
  });
  return sanitized;
};

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

const createMovement = async (movementData, userId) => {
  
  const sanitizedData = sanitizeFinanceInput(movementData);
  const newMovement = new Finance({ ...sanitizedData, userId });
  return await newMovement.save();
};

const updateMovement = async (movementId, userId, updateData) => {
  //Estrae i campi consentiti
  const sanitizedData = sanitizeFinanceInput(updateData);

  //Campi non validi/Body vuoto
  if (Object.keys(sanitizedData).length === 0) {
    throw new BadRequestException('No valid fields provided for update.');
  }

  return await Finance.findOneAndUpdate(
    { _id: movementId, userId },
    sanitizedData,
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