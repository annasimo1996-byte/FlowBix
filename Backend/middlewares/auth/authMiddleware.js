const jwt = require("jsonwebtoken");
const User = require("../../modules/users/usersSchema.js");
const { UnauthorizedException } = require("../../exceptions/customExceptions.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || "super_secret_key_backup"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return next(new UnauthorizedException("Not authorized, user not found"));
      }

      return next();
    } catch (error) {
      return next(new UnauthorizedException("Not authorized, invalid token"));
    }
  }

  if (!token) {
    return next(new UnauthorizedException("Not authorized, no token provided"));
  }
};

module.exports = { protect };