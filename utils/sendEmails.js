const nodeMailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const bcrypt = require('bcrypt');

const UserVerification = require('../models/emailVerification');
const ForgetPassword = require('../models/resetPassword');


// NodeMailer stuff
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
});

// Testing nodemailer
transporter.verify((error, success) => {
    if (error) {
        console.log("Email verification service down :", error);
    }
});


// Send Email Verification Message
const sendVerificationEmail = async ({ id, name, email }, res) => {
    const currentURL = `http://localhost:${process.env.PORT}`;
    const uniqueString = uuidv4() + id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email to Complete Registration",
        html: `
        <p style="margin-bottom: 5px;">Hi <b>${name},</b>
        </p> <p style="margin-bottom: 5px;">Thank you for signing up! To complete your registration and access your account, please verify your email address.</p> 
        <p style="margin-bottom: 5px;"><b>This verification link will expire in ${process.env.EMAIL_EXPIRE_MIN || 10} minutes.</b></p> 
        <p style="margin-bottom: 5px;">Click the button below to verify your email:</p> 
        <a href="${currentURL}/emailservice/user/verify/${id}/${uniqueString}" style="margin-bottom: 5px; text-decoration: none;">Verify Your Email</a> 
        <p style="margin-bottom: 5px;">If you didn't request this email, please ignore it.</p> 
        <p>Thank you,</p>
        <p>VMukti Solutions Pvt. Ltd</p>
        `,
    };

    try {
        const saltRounds = await bcrypt.genSalt(10)
        const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);

        let expireTimeOfVerification = (process.env.EMAIL_EXPIRE_MIN || 10) * 60 * 1000;

        // Saving the Email 
        await UserVerification.create({
            userId: id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + expireTimeOfVerification,
        });

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Email sending failed");
        }

        console.log("Email verification information saved in the database and email sent.");
    } catch (error) {
        console.error("An error occurred while sending the email to user for verification:", error);
        return res.status(500).json({ error: "An error occurred during the verification process", message: "Please contact the developer." });
    }
};

// Send forget email message
const sendForgetEmail = async ({ id, name, email }, res) => {
    const currentURL = `http://localhost:${process.env.PORT}`;
    const uniqueString = uuidv4() + id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: `
        <p style="margin-bottom: 5px;">Hi <b>${name},</b></p> 
        <p style="margin-bottom: 5px;">It seems like you requested a password reset. Click the link below to reset your password:</p> 
        <p style="margin-bottom: 5px;"><b>This link will expire in ${process.env.EMAIL_EXPIRE_MIN} minute.</b></p> 
        <a href="${currentURL}/emailservice/user/reset-password/${id}/${uniqueString}" style="margin-bottom: 5px; text-decoration: none;">Reset Your Password</a> 
        <p style="margin-bottom: 5px;">If you didn't request this, please ignore this email.</p> 
        <p>Thank you,</p>
        <p>VMukti Solutions Pvt. Ltd</p>`,
    };

    try {
        const saltRounds = await bcrypt.genSalt(10)
        const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);

        let expireTimeOfVerification = (process.env.EMAIL_EXPIRE_MIN || 10) * 60 * 1000;

        // Saving the Email Verification Info in DB
        const newResetPassword = await ForgetPassword.create({
            userId: id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + expireTimeOfVerification,
        });

        await transporter.sendMail(mailOptions);
        console.log("An email with the subject 'Reset Your Password' has been sent. Please check your inbox.");
        res.status(200).json({ message: "Email sent successfully", detail: "A password reset email has been sent to your email address. Please check your inbox to proceed with resetting your password." });
    } catch (error) {
        console.error("An error occurred while sending the email to user for verification:", error);
        return res.status(500).json({ error: "An error occurred during the verification process", message: "Please contact the developer." });
    }
};

module.exports = { sendVerificationEmail, sendForgetEmail };