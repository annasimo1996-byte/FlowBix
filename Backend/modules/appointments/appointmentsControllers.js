const {
  fetchAppointments,
  addAppointment,
  changeAppointmentStatus,
  removeAppointment,
} = require("./appointmentsService.js");

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await fetchAppointments(req.user._id);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const { clientId, date, service, price, status } = req.body;

    if (!clientId || !date || !service || price === undefined) {
      res.status(400);
      throw new Error("All mandatory fields must be filled in.");
    }

    const validStatuses = ["scheduled", "completed", "canceled"];
    const appointmentStatus = status && validStatuses.includes(status) ? status : "scheduled";

    const newAppointment = await addAppointment({
      userId: req.user._id,
      clientId,
      date,
      service,
      price,
      status: appointmentStatus,
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //selezione dello stato
    if (!["scheduled", "completed", "canceled"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status specified (allowed values: scheduled, completed, cancelled).");
    }

    const updated = await changeAppointmentStatus(id, req.user._id, status);
    if (!updated) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const deleted = await removeAppointment(req.params.id, req.user._id);
    if (!deleted) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    res.status(200).json({ message: "Appointment successfully deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};