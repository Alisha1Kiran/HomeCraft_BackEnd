const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for the user.
 * @param {Object} payload - The payload to encode in the token (e.g., user ID, email, role).
 * @returns {String} - The generated JWT token.
 */

const generateToken = (payload) => {
    return jwt.sign(payload, 'homeCraft_jwt_secret_123', { expiresIn: "1h" }); // Token expires in 1 hour
};

module.exports = generateToken;