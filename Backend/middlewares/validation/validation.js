const { BadRequestException } = require("../../exceptions/customExceptions");

const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    throw new BadRequestException("Invalid email format");
  }
  
  if (!password || password.length < 8) {
    throw new BadRequestException("Password must be at least 8 characters long");
  }

  next();
};

module.exports = { validateRegister };