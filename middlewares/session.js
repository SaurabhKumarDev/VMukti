
const myModule = (req, res, next) => {

    // // Taking the session detail from the header
    // const sessionDetail = req.header("Session");

    // if (!sessionDetail) {
    //     console.log("Session detail is not present on the request header");
    //     return res.status(401).json({error: "Session expired", message: "Session detail is missing from the request header. Please login in again to obtain that."})
    // }

    // try {
    //     if (sessionDetail.id && session.email ) {
    //         next()
    //     }
    // } catch (error) {
    //     console.error("Session: invalid session detail");
    //     return res.status(401).json({ error: "session", message: "Provided session detail is invalid. Please provide a valid session detail and try again." });
    // }

    // Without frontend only backend will done with this code
    if (!req || !res || typeof next !== 'function') {
        console.error("Request, Response object, or next function is missing.");
        return res.status(500).json({ error: "Internal Server Error" });
    }

    
    if (!req.session || !req.session.user) {
        console.log("Session expired. Please log in again.");
        return res.status(403).json({ message: "Session expired. Please log in again" });
    }

    next();
};











const sessionMiddleware = (req, res, next) => {
    // Taking the session detail from the header
    const sessionDetail = req.header("Session");

    if (!sessionDetail) {
        console.log("Session detail is not present on the request header");
        return res.status(401).json({ error: "Session expired", message: "Session detail is missing from the request header. Please login in again to obtain that." });
    }

    try {
        // const session = JSON.parse(sessionDetail); // Assuming sessionDetail is a JSON string

        // if (session.id && session.email) {
            // Here you can further validate session details if needed
            req.sessionDetail = sessionDetail; // Attach session to the request object
            next();
        // } else {
        //     throw new Error("Invalid session detail");
        // }



        
    } catch (error) {
        console.error("Session: invalid session detail");
        return res.status(401).json({ error: "session", message: "Provided session detail is invalid. Please provide a valid session detail and try again." });
    }
};



module.exports = myModule;