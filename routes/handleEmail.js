const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/user');
const UserVerification = require('../models/emailVerification');
const ForgetPassword = require('../models/resetPassword');


// Utility function to handle error response
const handleErrorResponse = (res, status, message) => {
    console.log(message);
    return res.status(status).json({ error: message });
};

// Verify Email
router.get('/verify/:userId/:uniqueString', async (req, res) => {
    const { userId, uniqueString } = req.params;

    try {
        const existingUser = await User.findById(userId);
        if (existingUser && existingUser.isEmailVerified) {
            return handleErrorResponse(res, 409, "User email is already verified");
        }

        const verificationRecord = await UserVerification.findOne({ userId });
        if (!verificationRecord) {
            return handleErrorResponse(res, 404, "No email verification record found. Try to sign up again.");
        }

        if (verificationRecord.expiresAt < Date.now()) {
            await UserVerification.deleteOne({ userId });
            await User.deleteOne({ _id: userId });
            const message = "Verification link has expired. Please sign up again.";
            return res.redirect(410, `/verified/error=true&message=${encodeURIComponent(message)}`);
        }

        const isUniqueStringMatched = await bcrypt.compare(uniqueString, verificationRecord.uniqueString);
        if (!isUniqueStringMatched) {
            const message = "Invalid verification code. Check your inbox.";
            return res.redirect(`/verified/error=true&message=${encodeURIComponent(message)}`);
        }

        await User.updateOne({ _id: userId }, { $set: { isEmailVerified: true, isAccountActive: true } });
        await UserVerification.deleteOne({ userId });

        const message = "User email verified successfully";
        return res.status(200).send(message);
    } catch (error) {
        console.error("An error occurred during the verification process:", error);
        const message = "An error occurred during the verification process";
        return res.redirect(500, `/verified/error=true&message=${encodeURIComponent(message)}`);
    }
});

// Reset Password
router.post('/reset-password/:userId/:uniqueString', [
    body("password").notEmpty().trim().isLength({ min: 8 }).isStrongPassword().withMessage("Enter strong password"),
    body("confirmPassword").notEmpty().trim().isLength({ min: 8 }).isStrongPassword().withMessage("Enter strong password")
], async (req, res) => {
    const { userId, uniqueString } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
            return handleErrorResponse(res, 400, "User does not exist");
        }

        const isForgetPasswordAvailable = await ForgetPassword.findOne({ userId });
        if (!isForgetPasswordAvailable) {
            return handleErrorResponse(res, 404, "No data available for Reset-Password. Try to reset-password again.");
        }

        if (isForgetPasswordAvailable.expiresAt < Date.now()) {
            await ForgetPassword.deleteOne({ userId });
            const message = "Link has expired. Please try to reset password again";
            return res.redirect(`/reset-password/error=true&message=${encodeURIComponent(message)}`);
        }

        const isUniqueStringMatched = await bcrypt.compare(uniqueString, isForgetPasswordAvailable.uniqueString);
        if (!isUniqueStringMatched) {
            const message = "Invalid verification code. Check your inbox.";
            return res.redirect(`/reset-password/error=true&message=${encodeURIComponent(message)}`);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleErrorResponse(res, 400, errors.array().map(err => err.msg).join(", "));
        }

        if (password !== confirmPassword) {
            return handleErrorResponse(res, 400, "Password and confirm password should be the same");
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        await User.findOneAndUpdate({ _id: userId }, { $set: { password: newPassword } }, { new: true });
        await ForgetPassword.deleteOne({ userId });

        const message = "Password reset successfully";
        return res.status(200).json({ message });
    } catch (error) {
        console.error("An error occurred during the password reset process:", error);
        const message = "An error occurred during the password reset process";
        return handleErrorResponse(res, 500, message);
    }
});

module.exports = router;