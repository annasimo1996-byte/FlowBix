const express = require("express");
const financeRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const {
    getExpenses,
    addExpense,
    editExpense,
    removeExpense,
} = require("./financeControllers.js");

financeRouter.use(protect);

financeRouter.get("/", getExpenses);
financeRouter.post("/", addExpense);
financeRouter.put("/:id", editExpense);
financeRouter.delete("/:id", removeExpense);

module.exports = financeRouter;