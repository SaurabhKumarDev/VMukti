


module.exports = async function allLogedInDevice (req, res) {
    // Check user & find role
    try {
        const isUserAuth = await user.findById(req.User);
        if (isUserAuth.role === "Super admin") {
            try {
                const loggedUser = await loginInfo.find({})
                return res.status(200).json({ User: isUserAuth.email, LoggedInUser: loggedUser })
            } catch (error) {
                console.error(error);
                return res.status(400).json({ error: "An error occured while fetching the loggedin user information", message: error.message })
            }
        } else {
            console.log("Soory, you are not allow to check the user login information");
            return res.status(401).json({ error: "Not authorized", message: "You are not authorized to check the logged in user details" })
        }
    } catch (error) {
        console.error("Auth user not found");
        res.status(404).json({ error: error.message, message: "Auth user not found" })
    }
}

// Login info
module.exports = async function OwnLoginDevice (req, res) {
    // Check user & find role
    try {
        const isUserAuth = await user.findById(req.User);
        if (isUserAuth.role === "Super admin") {
            try {
                const loggedUser = await loginInfo.find({ user_id: req.params.id })
                return res.status(200).json({ User: isUserAuth.email, LoggedInUser: loggedUser })
            } catch (error) {
                console.error(error);
                return res.status(400).json({ error: "An error occured while fetching the loggedin user information", message: error.message })
            }
        } else {
            console.log("Soory, you are not allow to check the user login information");
            return res.status(401).json({ error: "Not authorized", message: "You are not authorized to check the logged in user details" })
        }
    } catch (error) {
        console.error("Auth user not found");
        res.status(404).json({ error: error.message, message: "Auth user not found" })
    }
}