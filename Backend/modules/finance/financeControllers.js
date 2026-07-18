const financeService = require('./financeService.js');
const NotFoundException = require('../../exception/NotFoundException.js');

const getMovements = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Filtri opzionali dalla query string
        const { type, startDate, endDate } = req.query;
        
        const movements = await financeService.getMovements(userId, { type, startDate, endDate });
        
        res.status(200).json({ 
            success: true, 
            data: movements 
        });
    } catch (error) {
        next(error);
    }
};

const addMovement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { category, amount, date, description, type } = req.body;

        const newMovement = await financeService.createMovement({
            userId,
            category,
            amount,
            date: date || Date.now(),
            description,
            type: type || 'expense' 
        });

        res.status(201).json({ 
            success: true, 
            data: newMovement 
        });
    } catch (error) {
        next(error);
    }
};

const editMovement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const movementId = req.params.id;
        const updateData = req.body;

        const updatedMovement = await financeService.updateMovement(movementId, userId, updateData);
        
        if (!updatedMovement) {
            throw new NotFoundException('Movement not found or unauthorized');
        }

        res.status(200).json({ 
            success: true, 
            data: updatedMovement 
        });
    } catch (error) {
        next(error);
    }
};

const removeMovement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const movementId = req.params.id;

        const deletedMovement = await financeService.deleteMovement(movementId, userId);
        
        if (!deletedMovement) {
            throw new NotFoundException('Movement not found or unauthorized');
        }

        res.status(200).json({ 
            success: true, 
            message: 'Movement deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMovements,
    addMovement,
    editMovement,
    removeMovement
};