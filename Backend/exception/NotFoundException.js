const HttpException = require("./index.js"); 

class NotFoundException extends HttpException {
  constructor(message = "Resource not found") {
    super(message, 404, null);
  }
}

module.exports = NotFoundException;