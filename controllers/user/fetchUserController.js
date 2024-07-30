const user = require('../../models/user');

module.exports = async (req, res) => {
    try {    
        // Retrieve user using ID
        const retrieveUser = await user.findById(req.User);
        if (!retrieveUser) {
            console.log("User token expired. Please log in again to continue.");
            return res.status(400).json({ message: "User token expired. Please log in again to continue" });
        }

        // Fetch data based on user role
        let responseData = {};
        switch (retrieveUser.role) {
            case "Super admin":
                responseData = {
                    Admin: await user.find({ role: "Admin" }),
                    Manager: await user.find({ role: "Manager" }),
                    Users: await user.find({ role: "User" })
                };
                break;
            case "Admin":
                responseData = {
                    Manager: await user.find({ role: "Manager" }),
                    Users: await user.find({ role: "User" }),
                };
                break;
            case "Manager":
                responseData = {
                    Users: await user.find({ role: "User" }),
                };
                break;
            case "User":
                console.log("You do not have sufficient permissions");
                return res.status(403).json({ message: "You do not have sufficient permission" })
            default: {
                console.log("Undefined role of the current user")
                return res.status(400).json({ message: "Try to contact admin" });
            }
        }

        // Result
        res.status(200).json({ user: retrieveUser.email, Detail: responseData });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}