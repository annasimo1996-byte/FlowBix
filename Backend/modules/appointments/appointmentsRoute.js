const express = require("express");
const appointmentsRouter = express.Router();
const { protect } = require("../../middlewares/authMiddleware.js");
const {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("./appointmentsControllers.js");

//Rotte protette
appointmentsRouter.get("/", protect, getAppointments);
appointmentsRouter.post("/", protect, createAppointment);
appointmentsRouter.put("/:id", protect, updateAppointmentStatus);
appointmentsRouter.delete("/:id", protect, deleteAppointment);

module.exports = appointmentsRouter;