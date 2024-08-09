// Importing the jsonwebtoken
const user = require('../models/user');
const jwt = require("jsonwebtoken");

// Exporting function
module.exports = async (req, res, next) => {

    // Taking authtoken from the header
    // const authToken = req.header("Auth-Token");
    const authToken = req.cookies['jwt']
    
    // Checking the token is exist or not
    if (!authToken) {
        console.log("Authentication token is missing from the request header");
        return res.status(401).json({ error: "Unauthorized", message: "Authentication token is missing from the request header. Please log in to obtain a token." });
    }

    // Verifing the token
    try {
        const isCorrectToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

        const isValidToken = await user.findOne({ _id: isCorrectToken.User.id, 'tokens.token': authToken })
        if (!isValidToken) {
            res.clearCookie('jwt')
            res.clearCookie('session')
            console.error("Invalid token, login again");
            return res.status(401).json({ error: "Provided token is invalid", message: "Login again" })
        }

        // Extracting the User from isCorrectToken
        req.User = isCorrectToken.User.id;

        // Allow other middleware and route to do their job
        next()
    } catch (error) {
        console.log("JsonWebTokenError: invalid signature");
        return res.status(401).json({ error: "jsonWebTokenError", message: "The authentication token provided is invalid. Please provide a valid token and try again." });
    }
}