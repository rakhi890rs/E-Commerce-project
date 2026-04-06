const jwt = require('jsonwebtoken');

function createAuthMiddleware(roles = ["user"]) {
    return function authMiddleware(req, res, next) {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: No token provided',
            });
        }

        try {
            // Verify the token using your JWT secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the user's role is included in the allowed roles
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    message: 'Forbidden: Insufficient permissions',
                });
            }

            // Attach decoded user info to the request object
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid token',
            });
        }
    };
}

module.exports = createAuthMiddleware;