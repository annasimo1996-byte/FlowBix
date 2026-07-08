const jwt = require("jsonwebtoken");
const User = require("../modules/users/usersSchema.js");
const UnauthorizedException = require("../exception/UnauthorizedException");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_key_backup");

      // Cerca l'utente escludendo la password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        throw new UnauthorizedException("User belonging to this token no longer exists");
      }

      return next();
    }

    //senza un token valido
    if (!token) {
      throw new UnauthorizedException("Unauthorized, no token provided");
    }
  } catch (error) {
    // Se jwt.verify fallisce
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new UnauthorizedException("Unauthorized, invalid or expired token"));
    }
    
    // Passiamo qualsiasi altro errore imprevisto all'errorHandler
    next(error);
  }
};

module.exports = { protect };