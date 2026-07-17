const financeService = require('./financeService.js');
const NotFoundException = require('../../exception/NotFoundException.js');

const getExpenses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expenses = await financeService.getExpensesByUserId(userId);
        res.status(200).json({ 
            success: true, 
            data: expenses 
        });
    } catch (error) {
        next(error);
    }
};

const addExpense = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { 
            category, 
            amount, 
            date, 
            description 
        } = req.body;

        const newExpense = await financeService.createExpense({
            userId,
            category,
            amount,
            date: date || Date.now(),
            description
        });

        res.status(201).json({ 
            success: true, 
            data: newExpense 
        });
    } catch (error) {
        next(error);
    }
};

const editExpense = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;
        const updateData = req.body;

        const updatedExpense = await financeService.updateExpense(expenseId, userId, updateData);
        
        if (!updatedExpense) {
            throw new NotFoundException('Expense not found or unauthorized');
        }

        res.status(200).json({ 
            success: true, 
            data: updatedExpense 
        });
    } catch (error) {
        next(error);
    }
};

const removeExpense = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const deletedExpense = await financeService.deleteExpense(expenseId, userId);
        
        if (!deletedExpense) {
            throw new NotFoundException('Expense not found or unauthorized');
        }

        res.status(200).json({ 
            success: true, 
            message: 'Expense deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExpenses,
    addExpense,
    editExpense,
    removeExpense
};