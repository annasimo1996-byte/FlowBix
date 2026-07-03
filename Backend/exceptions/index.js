class HttpException extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error || null;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HttpException;