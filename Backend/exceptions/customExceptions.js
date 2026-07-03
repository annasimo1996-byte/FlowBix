const HttpException = require("./index.js");

class BadRequestException extends HttpException {
  constructor(message = "Invalid data provided", error = "Bad Request") {
    super(message, 400, error);
  }
}

class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized access or missing token", error = "Unauthorized") {
    super(message, 401, error);
  }
}

class ForbiddenException extends HttpException {
  constructor(message = "You do not have permission to access this resource", error = "Forbidden") {
    super(message, 403, error);
  }
}

class NotFoundException extends HttpException {
  constructor(message = "Resource not found", error = "Not Found") {
    super(message, 404, error);
  }
}

module.exports = {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException
};