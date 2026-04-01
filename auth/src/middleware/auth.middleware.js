const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "user not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
}

module.exports = authMiddleware;