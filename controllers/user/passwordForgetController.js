const bcrypt = require('bcrypt');
const user = require('../../models/user');
const { sendForgetEmail } = require('../../utils/sendEmails');

module.exports = async (req, res) => {
    try {
        const { email, securityQuestion, securityAnswer } = req.body;

        // Validate request body
        const validFields = ["email", "securityQuestion", "securityAnswer"];
        for (const field in req.body) {
            if (!validFields.includes(field)) {
                return res.status(400).json({ message: `Invalid field in the request body : '${field}'` });
            }
        }

        // Check user existance
        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ error: "User is not exist", message: "With this email address" });
        }

        // Ensure email is verified
        if (!userExist || !userExist.isEmailVerified) {
            return res.status(403).json({ message: "Your account is not verified. Please verify your email to reset your password." });
        }

        // Check the security question
        if (userExist.securityQuestion !== securityQuestion) {
            return res.status(400).json({ error: "Invalid securty question", message: "This is not your security question" })
        }

        // Check the Securyt-answer
        const isCorrectSecurityAnswer = await bcrypt.compare(securityAnswer, userExist.securityAnswer);
        if (!isCorrectSecurityAnswer) {
            return res.status(400).json({ error: "Incorrect security answer" })
        }

        // Sending the email for forget the password
        try {
            await sendForgetEmail(userExist, res);
            return res.status(200).json({ message: "Reset password email sent successfully" });
        } catch (error) {
            console.error("Some error occured while sending the 'Reset password email' : ", error.message);
            return res.status(500).json({ message: "Error occured while sending the email", error: "Reset the password" })
        }
    } catch (error) {
        console.error("Internal server error: ", error.message);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}