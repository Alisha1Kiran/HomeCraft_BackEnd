const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log("Cookies received:", req);
    res.header("Access-Control-Allow-Origin", "https://homecraft-app.netlify.app"); // Allow frontend
    res.header("Access-Control-Allow-Credentials", "true"); // ✅ Allow cookies
    try {
        const token = req.cookies.authToken;
        console.log("token: ", token);
        if(!token){
            return res.status(401).json({isAuthenticated: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user data to the request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({isAuthenticated: false, message: "Invalid or expired token..", error: error.message });
    }
}

module.exports = verifyToken;