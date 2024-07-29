const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const user = require('../../models/user');
const { sendVerificationEmail } = require('../../utils/sendEmails')

// Regular expression (regex)
const USPhoneNo = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
const internationalPhoneNo = /^\+?[1-9]\d{1,14}(\s?\d{1,13}){1,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&()_+}{"':;?/>.<,])[a-zA-Z\d!@#$%^&()_+}{"':;?/>.<,]{8,20}$/;
const checkSpecialCharacter = /[!@#$%^&*()\-=_+]/;


// Sign up
module.exports = async (req, res) => {

    // Validating
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, phone, password, securityQuestion, securityAnswer } = req.body;

    // Validate the request body for allowed fields only
    const allowedFields = ["name", "phone", "email", "password", "securityQuestion", "securityAnswer"];
    for (const field in req.body) {
        if (!allowedFields.includes(field)) {
            console.log("Invalid field of data you are trying to pass in request body");
            return res.status(400).json({ error: "Invalid field of data you are trying to pass in request body", invalidField: field });
        }
    }

    // Authorization token
    let authToken = "";

    try {

        // Checking User existancce
        let isExisting = await user.findOne({ email });

        // Check whether user verified
        if (isExisting && !isExisting.isEmailVerified) {
            return res.status(409).json({ error: "You are already register ur-self", message: "Please verify your email address and then log in to start enjoying the benefits of the site." })
        }

        // Account is already exist
        if (isExisting) {
            console.log("User already exists. Please log in.");
            return res.status(409).json({ message: "User already exists. Please log in." });
        }

        // Regex for phone
        if (!USPhoneNo.test(phone) || !internationalPhoneNo.test(phone)) {
            return res.status(400).json({ error: "Invalid Phone Number", message: "Invalid phone number format. Please provide a valid phone number" });
        }

        // Regex for password
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Weak password", messsage: "Please include at least one digit, one lowercase letter, one uppercase letter, one special character, and a minimum of 8 characters." })
        }
        if (checkSpecialCharacter.test(password.charAt(0)) || checkSpecialCharacter.test(password.charAt(password.length - 1))) {
            return res.status(400).json({ error: "Invalid Password", message: "Password should be not start and end with 'Special Character'" })
        }

        // Hashing password and security answer
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const hashSecurityAnswer = securityAnswer ? await bcrypt.hash(securityAnswer, salt) : "Cris";

        // Create new user
        const newUser = await user.create({
            name,
            phone,
            email,
            password: hashPassword,
            securityQuestion,
            securityAnswer: hashSecurityAnswer,
        })

        // Handle Email Verification
        sendVerificationEmail(newUser, res).catch(error => {
            console.error("Error sending verification email : ", error);
            return res.status(500).json({ error: "Verification email was not sent due to an error.", details: error.message });
        });

        // Messages
        console.log("New user created successfully");
        return res.status(201).json({ message: "New user added successfully", suggestion: "Verify your account via verification" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Error adding new user to database", message: error.message });
    }
}