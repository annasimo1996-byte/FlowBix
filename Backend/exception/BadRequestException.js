const { HttpException } = require("./index");

class BadRequestException extends HttpException {
  constructor(message = "Invalid request", errors = null) {
    super(message, 400, errors);
  }
}

module.exports = BadRequestException;