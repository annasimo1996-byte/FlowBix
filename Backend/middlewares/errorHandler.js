const HttpException = require("../exception/index.js");

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || null,
    });
  }

  console.error("SERVER CRITICAL ERROR:", err.message || err);

  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error",
  });
};

module.exports = errorHandler;