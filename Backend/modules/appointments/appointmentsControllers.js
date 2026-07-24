const {
  fetchAppointments,
  addAppointment,
  updateAppointmentService,
  removeAppointment,
} = require("./appointmentsService.js");
const BadRequestException = require("../../exception/BadRequestException.js");
const NotFoundException = require("../../exception/NotFoundException.js");

const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const appointments = await fetchAppointments(userId);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { clientId, date, time, service, price, status, notes, location, duration, title } = req.body;

    // Controllo campi minimi obbligatori
    if (!clientId || !date || !time) {
      throw new BadRequestException("Mandatory fields (clientId, date, time) must be provided.");
    }

    const validStatuses = ["scheduled", "completed", "canceled"];
    const appointmentStatus = status && validStatuses.includes(status) ? status : "scheduled";

    //Passa body e id autenticato
    const newAppointment = await addAppointment(
      {
        clientId,
        date,
        time,
        service,
        price,
        title,
        notes,
        location,
        duration,
        status: appointmentStatus,
      },
      userId
    );

    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestException("Request body cannot be empty");
    }

    const updated = await updateAppointmentService(id, userId, req.body);

    if (!updated) {
      throw new NotFoundException("Appointment not found or unauthorized.");
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const deleted = await removeAppointment(req.params.id, userId);

    if (!deleted) {
      throw new NotFoundException("Appointment not found or unauthorized.");
    }

    res.status(200).json({ message: "Appointment successfully deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};