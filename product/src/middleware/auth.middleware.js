const jwt = require("jsonwebtoken");

function createAuthMiddleware(roles = ["user"]) {
  return function (req, res, next) {
    try {
      //  get token from cookie OR header
      const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized: No token provided"
        });
      }

      //  verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  attach user to request
      req.user = decoded;

      //  role check
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Access denied"
        });
      }

      next(); 
    } catch (err) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }
  };
}

module.exports = createAuthMiddleware;