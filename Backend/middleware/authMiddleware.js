const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

    if (!token) {
        return res.status(401).json({ message: "❌ Token bulunamadı" });
    }

    const secret = process.env.JWT_SECRET || "default_secret";
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "❌ Token geçersiz" });
        }
        req.user = user; // payload buraya gelir
        next();
    });
}

module.exports = authMiddleware;
