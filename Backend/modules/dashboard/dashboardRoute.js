const express = require("express");
const dashboardRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const { getDashboardStats } = require("./dashboardControllers.js");

dashboardRouter.get("/stats", protect, getDashboardStats);

module.exports = dashboardRouter;