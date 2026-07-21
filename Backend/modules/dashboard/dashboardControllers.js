const { getDashboardStatsService } = require("./dashboardService.js");

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService(req.user._id);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
};