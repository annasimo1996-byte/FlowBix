const HttpException = require("./index.js");

class BadRequestException extends HttpException {
  constructor(message = "Invalid request", errors = null) {
    super(message, 400, errors);
  }
}

module.exports = BadRequestException;