const HttpException = require("./index.js");

class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized access") {
    super(message, 401, null);
  }
}

module.exports = UnauthorizedException;