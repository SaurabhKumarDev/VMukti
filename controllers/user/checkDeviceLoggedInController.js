const user = require('../../models/user');
const loginInfo = require('../../models/loginInfo');

// All loggedIn devices information
const allLogedInDevice = async (req, res) => {
    try {
        const isUserAuth = await user.findById(req.User);
        if (isUserAuth.role === "Super admin") {
            try {
                const loggedUser = await loginInfo.find({user_id: req.params.id})
                return res.status(200).json({ User: isUserAuth.email, LoggedInUser: loggedUser })
            } catch (error) {
                console.error(error);
                return res.status(400).json({ error: "An error occured while fetching the loggedin user information", message: error.message })
            }
        } else {
            console.log("Sorry, you are not authorized to check the logged-in user information");
            return res.status(403).json({ error: "Permission denied", message: "You are not authorized to access the logged-in user details" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

// Own login info
const ownLoginDevice = async (req, res) => {
    try {
        const isUserAuth = await user.findById(req.User);
        if (!isUserAuth) {
            return res.status(404).json({ error: "User not found", message: "Auth user not found" });
        }
        const loggedUser = await loginInfo.find({ user_id: isUserAuth._id })
        return res.status(200).json({ User: isUserAuth.email, LoggedInUser: loggedUser })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

module.exports = { allLogedInDevice, ownLoginDevice }