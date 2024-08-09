const User = require('../../models/user');
const LoginInfo = require('../../models/loginInfo');
const MongoStore = require('connect-mongo');

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
        await User.updateOne({ _id: userId }, { $pull: { 'tokens': { token: userActive.token } } });

        // Destroy the session
        const sessionStore = MongoStore.create({
            mongoUrl: process.env.MONGO_DB_NAME,
            collectionName: "session"
        })
        // Assuming sessionID is stored in req.sessionID
        sessionStore.destroy(userActive.session_id, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to destroy session' });
            }
            console.log(`User logged out: ${userActive.user_id}, Removed by: ${req.User}`);
            return res.status(200).json({ message: "User logged out and deleted from our database successfully" });
        });

    } catch (error) {
        console.error("An error occurred while logging out the user", error);
        return res.status(500).json({ error: error.message, message: "An error occurred while logging out the user" });
    }
};

// Regular user logout
const userLogout = async (req, res) => {
    try {
        // Extract the token from the request cookies
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

        // Remove the token from the user's tokens array
        await User.findByIdAndUpdate(req.User, { $pull: { 'tokens': { token } } });

        // Clear the JWT token & Session from the client-side
        res.clearCookie('jwt')
        res.clearCookie('session')

        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to destroy session' });
            }
            res.clearCookie('connect.sid');
            console.log("User logged out successfully");
            return res.status(200).json({ message: 'User logged out successfully' });
        });
    } catch (error) {
        console.error("An error occurred during user logout", error);
        return res.status(500).json({ error: error.message, message: "An error occurred during user logout" });
    }
};

module.exports = { adminLogOut, userLogout };