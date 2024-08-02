const User = require('../../models/user');
const LoginInfo = require('../../models/loginInfo');

// Logging out by the super admin
const adminLogOut = async (req, res) => {
    const userIdToLogout = req.params.id;

    try {
        const authUser = await User.findById(req.User);

        if (!authUser) {
            return res.status(404).json({ error: "Authenticated user not found" });
        }

        if (authUser.role !== "Super admin") {
            return res.status(401).json({ error: "Permission denied", message: "You are not authorized to check the logged-in user details" });
        }

        // Check if the user is active
        const userActive = await LoginInfo.findById(userIdToLogout);
        if (!userActive || userActive.status === "Not Active") {
            console.log("User already logged out");
            return res.status(400).json({ message: "User already logged out" });
        }

        // Update logout info
        await LoginInfo.findByIdAndUpdate(
            userIdToLogout,
            { $set: { logout_time: Date.now(), status: "Not Active" } },
            { new: true }
        );

        const userId = userActive.user_id;
        await User.updateOne({_id: userId}, { $pull: { 'tokens': { token: userActive.token } } });
        // res.clearCookie('jwt')
        console.log(`User logged out: ${userActive.user_id}, Removed by: ${req.User}`);
        return res.status(200).json({ message: "User logged out and deleted from our database successfully" });
    } catch (error) {
        console.error("An error occurred while logging out the user", error);
        return res.status(500).json({ error: error.message, message: "An error occurred while logging out the user" });
    }
};

// Regular user logout
const userLogout = async (req, res) => {
    try {
        // Extract the token from the request header
        // const token = req.header('Auth-token');
        const token = req.cookies['jwt']

        // Update logout info
        const userActive = await LoginInfo.findOneAndUpdate(
            { token },
            { $set: { logout_time: Date.now(), status: "Not Active" } },
            { new: true }
        );

        if (!userActive) {
            return res.status(400).json({ message: "User is already logged out or invalid token" });
        }

        await User.findByIdAndUpdate(req.User, { $pull: { 'tokens': { token } } });
        res.clearCookie('jwt')
        console.log("User logged out successfully");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("An error occurred during user logout", error);
        return res.status(500).json({ error: error.message, message: "An error occurred during user logout" });
    }
};

module.exports = { adminLogOut, userLogout };