const myModule = (req, res, next) => {
    // Check if the request, response, and next function are provided
    if (!req || !res || typeof next !== 'function') {
        console.error("Request, Response object, or next function is missing.");
        return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the session exists and if the user is logged in
    if (!req.session || !req.session.user) {
        res.clearCookie('jwt')
        res.clearCookie('session')
        console.log("Session expired. Please log in again.");
        return res.status(403).json({ message: "Session expired. Please log in again" });
    }

    next();
};

module.exports = myModule;