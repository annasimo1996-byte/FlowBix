const Client = require("../clients/clientsSchema.js");
const Appointment = require("../appointments/appointmentsSchema.js");
const Finance = require("../finance/financeSchema.js");

const getDashboardStatsService = async (userId) => {
  //Clienti Totali
  const totalClients = await Client.countDocuments({ userId });

  //Appuntamenti di Oggi
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayAppointments = await Appointment.countDocuments({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  //Bilancio Netto
  // A) Entrate da Appuntamenti Completati
  const completedAppointments = await Appointment.aggregate([
    {
      $match: {
        userId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$price" },
      },
    },
  ]);

  const appointmentIncome = completedAppointments[0]?.totalIncome || 0;

  // B) Spese Manuali da Finance
  const financeAggregation = await Finance.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let extraIncome = 0;
  let totalExpenses = 0;

  financeAggregation.forEach((item) => {
    if (item._id === "income") extraIncome = item.total;
    if (item._id === "expense") totalExpenses = item.total;
  });

  // Saldo Netto
  const netBalance = appointmentIncome + extraIncome - totalExpenses;

  return {
    totalClients,
    todayAppointments,
    netBalance,
  };
};

module.exports = {
  getDashboardStatsService,
};