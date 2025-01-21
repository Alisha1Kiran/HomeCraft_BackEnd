const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        console.log("token: ", token);
        if(!token){
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, 'homeCraft_jwt_secret_123');
        // Attach user data to the request
        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token..", error: error.message });
    }
}

module.exports = verifyToken;