const Finance = require('./financeSchema.js');

const getExpensesByUserId = async (userId) => {
    return await Finance.find({ userId }).sort({ date: -1 });
};

const createExpense = async (expenseData) => {
    const newExpense = new Finance(expenseData);
    return await newExpense.save();
};

const updateExpense = async (expenseId, userId, updateData) => {
    const updatedExpense = await Finance.findOneAndUpdate(
        { _id: expenseId, userId },
        updateData,
        { new: true, runValidators: true }
    );
    return updatedExpense;
};

const deleteExpense = async (expenseId, userId) => {
    const deletedExpense = await Finance.findOneAndDelete({ _id: expenseId, userId });
    return deletedExpense;
};

module.exports = {
    getExpensesByUserId,
    createExpense,
    updateExpense,
    deleteExpense
};