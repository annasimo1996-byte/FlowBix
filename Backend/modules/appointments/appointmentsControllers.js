const {
  fetchAppointments,
  addAppointment,
  updateAppointmentService,
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
    let { clientId, date, time, service, price, status } = req.body;

    if (!clientId || !date || !time || !service || price === undefined) {
      res.status(400);
      throw new Error("All mandatory fields must be filled in.");
    }

    // Conversione della data se arriva come stringa DD/MM/YYYY dal frontend
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      date = new Date(`${year}-${month}-${day}`);
    }

    const validStatuses = ["scheduled", "completed", "canceled"];
    const appointmentStatus = status && validStatuses.includes(status) ? status : "scheduled";

    const newAppointment = await addAppointment({
      userId: req.user._id,
      clientId,
      date,
      time, 
      service,
      price,
      status: appointmentStatus,
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const updateData = {};
    const allowedFields = ["clientId", "date", "time", "service", "price", "status"];
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.date && typeof updateData.date === 'string' && updateData.date.includes('/')) {
      const [day, month, year] = updateData.date.split('/');
      updateData.date = new Date(`${year}-${month}-${day}`);
    }

    const updated = await updateAppointmentService(id, req.user._id, updateData);

    if (!updated) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("ERRORE DETTAGLIATO UPDATE:", err);
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
  updateAppointment,
  deleteAppointment,
};