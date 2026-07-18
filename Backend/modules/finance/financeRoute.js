const express = require("express");
const financeRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const {
    getMovements,
    addMovement,
    editMovement,
    removeMovement
} = require("./financeControllers.js");

financeRouter.use(protect);

financeRouter.get("/", getMovements);
financeRouter.post("/", addMovement);
financeRouter.put("/:id", editMovement);
financeRouter.delete("/:id", removeMovement);

module.exports = financeRouter;