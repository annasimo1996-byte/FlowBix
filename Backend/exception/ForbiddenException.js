const HttpException = require("./index.js");

class ForbiddenException extends HttpException {
  constructor(message = "Forbidden access", errors = null) {
    super(message, 403, errors);
  }
}

module.exports = ForbiddenException;