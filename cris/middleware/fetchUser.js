// Importing the jsonwebtoken
const jwt = require("jsonwebtoken");

// Exporting function
module.exports = (req, res, next) => {

    // Taking authtoken from the header
    const authToken = req.header("Auth-Token");

    // Checking the token is exist or not
    if (!authToken) {
        console.log("Authentication token is missing from the request header");
        return res.status(401).json({ error: "Unauthorized", message: "Authentication token is missing from the request header. Please log in to obtain a token." });
    }

    // Verifing the token
    try {
        const isCorrectToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

        // 'req.User' fetched where you call the fetchUser functionality
        // Extracting the User from isCorrectToken
        req.User = isCorrectToken.User.id;

        // Allow other middleware and route to do their job
        next()
    } catch (error) {
        console.log("JsonWebTokenError: invalid signature");
        return res.status(401).json({ error: "jsonWebTokenError", message: "The authentication token provided is invalid. Please provide a valid token and try again." });
    }
}