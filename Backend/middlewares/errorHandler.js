const { HttpException } = require("../exception/index");

const errorHandler = (err, req, res, next) => {
  // 1. Se l'errore è una delle eccezioni personalizzate
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Log in console dei bug interni del server (es. crash di sintassi)
  console.error("💥 SERVER CRITICAL ERROR:", err.message || err);

  // 2. Fallback per errori generici non intercettati (500)
  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error",
  });
};

module.exports = errorHandler;