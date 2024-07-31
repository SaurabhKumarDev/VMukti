const User = require('../../models/user');
const LoginInfo = require('../../models/loginInfo');

// Logging out by the super admin
module.exports.adminLogOut = async (req, res) => {
    const userIdToLogout = req.params.id;

    try { 
        const authUser = await User.findById(req.User);

        if (!authUser) {
            return res.status(404).json({ error: "Authenticated user not found" });
        }

        if (authUser.role !== "Super admin") {
            return res.status(401).json({ error: "Not authorized", message: "You are not authorized to check the logged-in user details" });
        }

        const userToLogout = await LoginInfo.findById(userIdToLogout);

        if (!userToLogout) {
            return res.status(404).json({ error: "User not found", message: "User may have been deleted already" });
        }

        const userToLogoutId = userToLogout.user_id;
        const tokenToLogout = userToLogout.token;

        // Remove the token from the user's token array
        await User.findByIdAndUpdate(userToLogoutId, { $pull: { tokens: { token: tokenToLogout } } });

        // Delete the login info document
        await LoginInfo.findByIdAndDelete(userIdToLogout);

        return res.status(200).json({ message: "User logged out and deleted from our database successfully" });
    } catch (error) {
        console.error("An error occurred while logging out the user", error);
        return res.status(500).json({ error: error.message, message: "An error occurred while logging out the user" });
    }
};

// Regular user logout
module.exports.userLogout = async (req, res) => {
    try {
        // Extract the token from the request header
        const token = req.header('Auth-token');

        // Update logout info
        await LoginInfo.updateOne(
            { user_id: req.session.user.id },
            { $set: { logout_time: Date.now(), status: "Not Active" } },
            { new: true }
        );
        await User.findByIdAndUpdate(req.session.user.id, { $pull: { tokens: { token: token } } });
        
        // Session outing
        req.session.destroy(async (err) => {
            if (err) {
                return res.status(500).json({ error: "Could not log out", message: "Session destruction failed" });
            }

            console.log("User logged out successfully");
            return res.status(204).json({ message: "User logged out successfully" });
        });
    } catch (error) {
        console.error("An error occurred during user logout", error);
        return res.status(500).json({ error: error.message, message: "An error occurred during user logout" });
    }
};
