const HttpException = require("../exception/index.js");
const BadRequestException = require("../exception/BadRequestException.js");

const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Gestione errori Mongoose: CastError (es. ID non valido)
  if (err.name === "CastError") {
    return res.status(400).json({
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}.`,
    });
  }

  // Gestione errori Mongoose: ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      statusCode: 400,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Gestione MongoDB: Duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(400).json({
      statusCode: 400,
      message: `Duplicate value for field: ${field}.`,
    });
  }

  console.error("SERVER CRITICAL ERROR:", err.message || err);

  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error",
  });
};

module.exports = errorHandler;