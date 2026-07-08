const { HttpException } = require("./index");

class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized access") {
    super(message, 401, null);
  }
}

module.exports = UnauthorizedException;