const Appointment = require("./appointmentsSchema.js");

//Campi modificabili
const ALLOWED_APPOINTMENT_FIELDS = [
  "clientId",
  "title",
  "date",
  "time",
  "duration",
  "status",
  "notes",
  "location"
];

// Helper per formattare la data DD/MM/YYYY in un oggetto Date di JS
const parseDateString = (dateInput) => {
  if (typeof dateInput === 'string' && dateInput.includes('/')) {
    const [day, month, year] = dateInput.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  return dateInput;
};

// Helper interno per estrarre solo i campi autorizzati
const sanitizeAppointmentInput = (inputData) => {
  const sanitized = {};
  ALLOWED_APPOINTMENT_FIELDS.forEach((field) => {
    if (inputData[field] !== undefined) {
      sanitized[field] = inputData[field];
    }
  });

  // Gestione formato data
  if (sanitized.date) {
    sanitized.date = parseDateString(sanitized.date);
  }

  return sanitized;
};

const fetchAppointments = async (userId) => {
  return await Appointment.find({ userId })
    .populate("clientId", "name surname email phone")
    .sort({ date: 1 });
};

const addAppointment = async (appointmentData, userId) => {
  const sanitizedData = sanitizeAppointmentInput(appointmentData);
  
  const newAppointment = new Appointment({ ...sanitizedData, userId });
  const savedAppointment = await newAppointment.save();
  
  return await savedAppointment.populate("clientId", "name surname email phone");
};

const updateAppointmentService = async (id, userId, updateData) => {
  //Estrae solo i campi consentiti
  const sanitizedData = sanitizeAppointmentInput(updateData);

  return await Appointment.findOneAndUpdate(
    { _id: id, userId },
    sanitizedData, 
    { returnDocument: "after", runValidators: true }
  ).populate("clientId", "name surname email phone");
};

const changeAppointmentStatus = async (id, userId, status) => {
  //Aggiorna solo lo stato
  return await Appointment.findOneAndUpdate(
    { _id: id, userId },
    { status },
    { returnDocument: "after", runValidators: true }
  );
};

const removeAppointment = async (id, userId) => {
  return await Appointment.findOneAndDelete({ _id: id, userId });
};

module.exports = {
  fetchAppointments,
  addAppointment,
  updateAppointmentService,
  changeAppointmentStatus,
  removeAppointment,
};