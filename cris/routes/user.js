const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser");

// Sign up : Name, Phone, Role (Limited role), Email, Password (Hashing)
router.post('/register', [
    body('name').notEmpty().trim().isLength({ min: 3 }).withMessage("Should be length of the name is minimum 3"),
    body('role').notEmpty().trim().isLength({ min: 4, max: 12 }).withMessage("Invalid role"),
    body('email').notEmpty().trim().normalizeEmail().isEmail().withMessage("Incorrect Email"),
    body('password').notEmpty().trim().isLength({ min: 8 }).isStrongPassword(),
    body('securityQuestion').notEmpty().trim().withMessage("Enter security question"),
    body("securityAnswer").notEmpty().trim().withMessage("Please enter security question answer")
], async (req, res) => {

    // Validating
    const checkingValidation = validationResult(req);
    if (!checkingValidation.isEmpty()) {
        console.log(checkingValidation.errors);
        return res.status(400).json({ error: checkingValidation.errors });
    }

    // Regular expression (regex)
    const USPhoneNo = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    const internationalPhoneNo = /^\+?[1-9]\d{1,14}(\s?\d{1,13}){1,4}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&()_+}{"':;?/>.<,])[a-zA-Z\d!@#$%^&()_+}{"':;?/>.<,]{8,}$/;

    try {
        const { name, role, email, phone, securityQuestion, securityAnswer, password } = req.body;

        // Checking User existancce
        let isExisting = await user.findOne({ email: email });
        if (isExisting) {
            console.log("User already exist with this credentials");
            return res.status(409).json({ message: "Attempting to create duplicate user" });
        }

        // Correcting the format of the Role
        let storeRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        // Authorization token
        let authToken = "";

        // Checking for the correct role
        if (storeRole === "Super admin" || storeRole === "Admin" || storeRole === "Manager" || storeRole === "User") {

            // Regex for phone
            if (!USPhoneNo.test(phone) || !internationalPhoneNo.test(phone)) {
                console.log("Invalid phone number");
                return res.status(400).json({ error: "Invalid Phone Number", message: "Invalid phone number format. Please provide a valid phone number" });
            }

            // Regex for password
            if (!passwordRegex.test(password)) {
                console.log("Weak password, Use strong one");
                return res.status(400).json({ error: "Weak password", messsage: "Please include at least one digit, one lowercase letter, one uppercase letter, one special character, and a minimum of 8 characters." })
            }

            // Converting the password in hash code
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Converting the security answer in hash code
            const saltAnswer = await bcrypt.genSalt(10);
            const hashSecurityAnswer = await bcrypt.hash(securityAnswer, saltAnswer);

            // User Creation
            const newUser = await user.create({
                name: name,
                role: storeRole,
                phone: phone,
                email: email,
                securityQuestion: securityQuestion,
                securityAnswer: hashSecurityAnswer,
                password: hashPassword
            })

            // JWT
            const data = { User: { id: newUser.id } };
            authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);

        } else {
            console.log("Incorrect role");
            return res.status(400).json({ error: "Incorrect role" });
        }

        // Messages
        console.log("New user added to database successfully but still need verify by the Super Admin");
        return res.status(201).json({ message: "New user added successfully", pending: "Waiting for the permission", token: authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Some error occur while adding the new user to our database" });
    }
})

// Login : Email & Password with 2FA
router.post('/login', [
    body('email').notEmpty().trim().isEmail(),
    body('password').notEmpty().trim().isStrongPassword()
], async (req, res) => {
    try {
        const { email, password } = req.body;

        // Searching for the existing user
        let userExist = await user.findOne({ email: email });
        if (!userExist) {
            console.log("User is not exist with this Credential");;
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Too many attempts
        if (userExist.loginAttempts >= 3) {
            const newLoginAttempt = userExist.loginAttempts + 1;
            await user.findByIdAndUpdate(userExist.id, { $set: { loginAttempts: newLoginAttempt } }, { new: true });
            console.log("Account locked due to too many failed login attempts");
            return res.status(400).json({ message: "Account locked due to too many failed login attempts" })
        }

        // Incorrect password
        const isPasswordVaild = await bcrypt.compare(password, userExist.password)
        if (!isPasswordVaild) {
            const newLoginAttempt = userExist.loginAttempts + 1;
            await user.findByIdAndUpdate(userExist.id, { $set: { loginAttempts: newLoginAttempt } }, { new: true });
            console.log("Wrong password entered");
            return res.status(401).json({ message: "Wrong password entered" });
        }

        // Update login time
        await user.findByIdAndUpdate(userExist.id, { $set: { lastLogin: Date.now() } }, { new: true });

        // Generate JWT Token
        const data = { User: { id: userExist.id } }
        const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);

        // Printed message
        console.log("User Loggedin successfully");
        return res.status(200).json({ message: "User Login Successfully", token: authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error : ", message: error.message });
    }
})

// Fetch via middleware
router.get('/fetch', fetchUser, async (req, res) => {
    try {

        // Retrieve user using ID
        const retrieveUser = await user.findOne({ _id: req.User });

        // Glitch
        if (!retrieveUser) {
            console.log("Unexpected error occured");
            return res.status(400).json({ message: "Unexpected error occured" });
        }

        // Fetch data based on user role
        let responseData;
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
            case "User": {
                console.log("You do not have sufficient permissions");
                return res.status(403).json({ message: "You do not have sufficient permission" })
            };
            default: {
                console.log("Not defined role of the current user")
                return res.status(400).json({ message: "Try to contact admin", retrieveUser });
            }
        }

        // Result
        console.log(`Detail Fetched By : ${retrieveUser.email}`);
        res.status(200).json({ user: retrieveUser.email, Detail: responseData });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

// Update : Phone, Role, Approving, Security question, Security answer, loginAttempts, email
router.put('/update/user/:id', fetchUser, async (req, res) => {
    try {
        // Check if req.body is empty
        if (Object.keys(req.body).length === 0) {
            console.error("Request body is empty. Provide data to update");
            return res.status(400).json({
                error: "Bad Request",
                message: "Request body is empty. Provide data to update."
            });
        }

        // Check the role of User who trying to update the data
        let userRole = await user.findById(req.User);
        userRole = userRole.role;

        if (userRole){}

        // Data to be update 
        const { phone, role, isApproved, securityQuestion, securityAnswer, loginAttempts, email } = req.body;

        // Ensure at least one field is being updated OR trying to add new field without updating existing field
        if (phone === undefined && role === undefined) {
            console.log("No valid fields to update");
            return res.status(400).json({ message: "No valid fields to update. Provide valid data." });
        }

        // Validate the request body for allowed fields only
        const allowedFields = ["phone", "role"];
        for (const field in req.body) {
            if (!allowedFields.includes(field)) {
                console.log("Invalid field in request body");
                return res.status(400).json({ message: `Invalid field '${field}' in request body` });
            }
        }

        // Create an object to hold the fields to be update
        const updatedUser = {};
        if (phone) {
            // Regular expression (regex)
            const USPhoneNo = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
            const internationalPhoneNo = /^\+?[1-9]\d{1,14}(\s?\d{1,13}){1,4}$/;
            if (!USPhoneNo.test(phone) || !internationalPhoneNo.text(phone)) {
                console.log("Invalid phone number format. Please provide a valid phone number.");
                return res.status(400).json({ error: "Invalid Phone Number", message: "Invalid phone number format. Please provide a valid phone number" });
            }
            updatedUser.phone = phone;
        }
        if (role) {
            let storeRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            updatedUser.role = storeRole;
        }

        // Update user data
        let newEntry = await user.findByIdAndUpdate(req.User, { $set: updatedUser }, { new: true });

        // Result if successfully updated
        console.log("User data updated");
        return res.status(200).json({ message: "User data is updated successfully", updatedUser: updatedUser });
    } catch (error) {
        console.error("Internal server error : ", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

// Forgot Password using email and Password
router.patch('/forget',
    [
        body('email').notEmpty().trim(),
        body('role').notEmpty().trim().isLength({ min: 4, max: 12 })

    ], async (req, res) => {
        try {
            const { email, role, new_password } = req.body;

            // Check there are should be three field not more in request body
            if (!role) {
                console.log("Role definition is required");
                return res.status(400).json({ message: "Role definition is required for user authentication." });
            } else if (!new_password) {
                console.log("New password definition is required.");
                return res.status(400).json({ message: "New password definition is required for changing the password." });
            }

            // Filter out wrong entries
            const validFields = ["email", "role", "new_password"];
            for (const field in req.body) {
                if (!validFields.includes(field)) {
                    console.log("Invalid entry");
                    return res.status(400).json({ message: `Invalid field in the request body : '${field}'` });
                }
            }

            // Findin the user
            const isUserExist = await user.findOne({ email: req.body.email });

            // Checking user existance of the user
            if (!isUserExist) {
                console.log("User does not exist, please sign up first.");
                return res.status(404).json({ message: "User does not exist", solution: "Recheck email or create a new account." });
            }

            // Confirming user via role
            if (isUserExist.role !== req.body.role) {
                console.error("Entered wrong role");
                return res.status(400).json({ message: "Unauthorized user attempting to reset the password due to entering an incorrect user role." });
            }

            // Validatin the password using the regular regex
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&()_+}{"':;?/>.<,])[a-zA-Z\d!@#$%^&()_+}{"':;?/>.<,]{8,}$/;
            if (!passwordRegex.test(new_password)) {
                console.log("The entered password is weak");
                return res.status(400).json({ error: "Weak password", messsage: "Please include at least one digit, one lowercase letter, one uppercase letter, one special character, and a minimum of 8 characters." })
            }

            // Updating data in object
            let updateThis = {};

            // Decrypt the new password
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(new_password, salt);
            updateThis.password = newPassword;

            // Updating the password
            await user.findOneAndUpdate(isUserExist._id, { $set: updateThis }, { new: true });

            // Passing the output (Password)
            console.log(`Password updated successfully`);
            res.status(200).json({ message: "Your password is updated successfully" });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal Server Error", message: error.message });
        }
    }
)

// Deleting the user as per their role
router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {
        const userId = req.User;
        const targetUserId = req.params.id;

        // Checking the user attempting to delete
        const whoTryToRemoveUser = await user.findById(userId);

        // If role is not present 
        if (!whoTryToRemoveUser.role) {
            console.log("No role found for the user attempting to delete.");
            return res.status(404).json({ message: "User role not found, So you're not allow to remove anyone" })
        }

        // Fetching the user to be deleted
        const deleteUser = await user.findById(targetUserId);
        if (!deleteUser) {
            console.log("User to delete not found");
            return res.status(404).json({ message: "User to delete not found" })
        } else if (!deleteUser.role) {
            console.log("Role is not defined to delete a user");
            return res.status(404).json({ message: "User to delete not found role" })
        }

        // As per User role deleting the user
        if (whoTryToRemoveUser.role === "Admin") {

            // Find out the role of removing USER
            const roleOfDeletingUser = deleteUser.role;
            if (roleOfDeletingUser === "Manager" || roleOfDeletingUser === " User") {

                // Removing the user from the database
                await user.findByIdAndDelete(targetUserId);

                // Result
                console.log("User removed successfully");
                return res.status(200).json({ message: "User removed successfully", deletedUser: removed })

            } else {
                console.log("You are not authorize to delete this User");
                return res.status(400).json({ message: "You are not allowed to remove this User from the database" });
            }
        } else if (whoTryToRemoveUser.role === "Super admin") {
            const roleOfDeletingUser = deleteUser.role;

            // If the role of mediator is "Super Admin" then
            if (roleOfDeletingUser === "User" || roleOfDeletingUser === "Manager" || roleOfDeletingUser === "Admin") {
                // Remove User
                await user.findByIdAndDelete(targetUserId)

                // Result
                console.log("User removed successfully");
                return res.status(200).json({ message: "User removed successfully", deletedUser: removed });
            } else {
                console.log("You are not authorzied to remove this user from the database");
                return res.status(400).json({ message: "You are not authorized to remove this user from the database", solution: "Contact Developer" });
            }
        }
        else {
            console.log("You are not authorized to delete this user");
            return res.status(403).json({ message: "You are not authorized to delete this user" });
        }
    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({ message: "Some error occure while removing the user from the database", error: error });
    }
})

module.exports = router;