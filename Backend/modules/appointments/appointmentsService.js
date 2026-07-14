const Appointment = require("./appointmentsSchema.js");

const fetchAppointments = async (userId) => {
  return await Appointment.find({ userId })
  .populate("clientId", "name surname email phone")
  .sort({ date: 1 });
};

const addAppointment = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

const changeAppointmentStatus = async (id, userId, status) => {
  return await Appointment.findOneAndUpdate(
    { _id: id, userId },
    { status },
    { new: true, runValidators: true }
  );
};

const removeAppointment = async (id, userId) => {
  return await Appointment.findOneAndDelete({ _id: id, userId });
};

module.exports = {
  fetchAppointments,
  addAppointment,
  changeAppointmentStatus,
  removeAppointment,
};