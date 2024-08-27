const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../../models/user');
const LoginInfo = require('../../models/loginInfo');
require('dotenv').config();

module.exports = async (req, res) => {
    try {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, password, browser, platform, private_ip, address } = req.body;

        // Find the existing user
        const userExist = await User.findOne({ email });
        if (!userExist) {
            console.log("User does not exist with this credential");
            return res.status(404).json({ message: "User doesn't exist with this credential" });
        }

        // Check if the user is verified
        if (!userExist.isEmailVerified) {
            console.log("User account is not verified. Prompting user to verify their account before logging in.");
            return res.status(400).json({ error: "Verification Required", message: "Please verify your account to log in or access your profile." });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, userExist.password);
        if (!isPasswordValid) {
            await userExist.incrementLoginAttempt();
            console.log("Wrong password entered");
            return res.status(401).json({ message: "Wrong password entered" });
        }

        // Check if the user's account is active
        if (!userExist.isAccountActive) {
            if (userExist.lockUntil && userExist.lockUntil < Date.now()) {
                await User.findByIdAndUpdate(userExist.id, { $set: { lockUntil: null, loginAttempts: 0, isAccountActive: true } }, { new: true });
            } else {
                console.log(`Account is locked. Try again later after ${process.env.LOCK_UNTIL_MIN || 10} minutes.`);
                return res.status(400).json({ error: "Account locked", message: "Try after 24 hours" });
            }
        }

        // Generate JWT
        const authToken = await userExist.getAuthToken();

        // Store user in the session            
        req.session.user = { id: userExist._id, email: userExist.email };

        // Store the cookie
        res.cookie('session', req.sessionID, {
            maxAge: process.env.COOKIE_EXPIRE_MIN * 60 * 1000 || 2 * 60 * 1000, // Default to 2 minutes
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Set to true in production
            // sameSite: 'lax', // Ensures the cookie is sent only to the same site
        });
        // Setting the cookie
        res.cookie('jwt', authToken, {
            maxAge: process.env.COOKIE_EXPIRE_MIN * 60 * 1000 || 2 * 60 * 1000, // Default to 2 minutes
            // httpOnly: true, // Prevents JavaScript access to the cookie
            // secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
            // sameSite: 'strict', // Ensures the cookie is sent only to the same site
            // path: '/' // Cookie is accessible throughout the entire site
        });

        // Store the login information
        await LoginInfo.create({
            user_id: userExist.id,
            browser,
            platform,
            token: authToken,
            private_ip,
            address,
            session_id: req.sessionID,
            status: "Active",
            login_time: Date.now(),
        });

        // Printed message
        console.log("User logged in successfully");
        return res.status(200).json({ message: "User login successful", token: authToken, session: req.sessionID });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
};