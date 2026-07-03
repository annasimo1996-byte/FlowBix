const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log]: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorType = err.error || "Internal Server Error";

  return res.status(statusCode).json({
    status: "error",
    statusCode,
    error: errorType,
    message
  });
};

module.exports = errorHandler;