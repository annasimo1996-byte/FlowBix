const Appointment = require("./appointmentsSchema.js");

const fetchAppointments = async (userId) => {
  return await Appointment.find({ userId })
    .populate("clientId", "name surname email phone")
    .sort({ date: 1 });
};

const addAppointment = async (appointmentData) => {
  // DD/MM/YYYY -> oggetto Date
  if (appointmentData.date && typeof appointmentData.date === 'string' && appointmentData.date.includes('/')) {
    const [day, month, year] = appointmentData.date.split('/');
    appointmentData.date = new Date(`${year}-${month}-${day}`);
  }

  return await Appointment.create(appointmentData);
};

const updateAppointmentService = async (id, userId, updateData) => {
  if (updateData.date && typeof updateData.date === 'string' && updateData.date.includes('/')) {
    const [day, month, year] = updateData.date.split('/');
    updateData.date = new Date(`${year}-${month}-${day}`);
  }

  return await Appointment.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { returnDocument: "after", runValidators: true }
  ).populate("clientId", "name surname email phone");
};

const changeAppointmentStatus = async (id, userId, status) => {
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