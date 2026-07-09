const jwt = require("jsonwebtoken");
const User = require("../modules/users/usersSchema.js");
const UnauthorizedException = require("../exception/UnauthorizedException");

const protect = async (req, res, next) => {
  try {
    //Verifica header Authorizations
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];

      //Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        throw new UnauthorizedException("User belonging to this token no longer exists");
      }

      return next();
    }

    //Header assente o non conforme
    throw new UnauthorizedException("Unauthorized, no token provided");

  } catch (error) {
    //Errori di firma o scadenza del JWT
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new UnauthorizedException("Unauthorized, invalid or expired token"));
    }
    
    //Qualsiasi altro errore all'errorHandler
    next(error);
  }
};

module.exports = { protect };