const jwt = require('jsonwebtoken');

function sellerDashboardMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'seller') {
            return res.status(403).json({
                message: 'Forbidden: Seller access only',
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid token',
        });
    }
}

module.exports = sellerDashboardMiddleware;