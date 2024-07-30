const user = require('../../models/user');
const { validationResult } = require('express-validator');
const {sendVerificationEmail} = require('../../utils/sendEmails');
const bcrypt = require('bcrypt');

// Regular expression (regex)
const USPhoneNo = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
const internationalPhoneNo = /^\+?[1-9]\d{1,14}(\s?\d{1,13}){1,4}$/;

module.exports = async (req, res) => {
    try {
        const userToUpdateId = req.params.id;
        const userUpdaterId = req.User;

        // Fetch users
        const [userUpdater, userToUpdate] = await Promise.all([
            user.findById(userUpdaterId),
            user.findById(userToUpdateId)
        ]);

        // Check if users exist
        if (!userUpdater) {
            console.error("User updater may be deleted. Retry login or contact support.");
            return res.status(404).json({ error: "User updater may be deleted", message: "Retry login or contact support" });
        }
        if (!userToUpdate) {
            console.error("User to update not found. The user might have deleted their account.");
            return res.status(404).json({ error: "User not found", message: "The user might have deleted their account" });
        }

        // Validate request body
        if (Object.keys(req.body).length === 0) {
            console.error("Request body is empty. Provide data to update.");
            return res.status(400).json({ error: "Bad Request", message: "Request body is empty. Provide data to update." });
        }

        const { name, phone, email, role, isApproved, securityQuestion, securityAnswer } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            return res.status(400).json({ error: "Validation error", message: errors.array() });
        }

        // Validate fields
        const allowedFields = ["name", "phone", "role", "isApproved", "securityQuestion", "securityAnswer", "email"];
        for (const field in req.body) {
            if (!allowedFields.includes(field)) {
                console.error("Invalid field:", field);
                return res.status(400).json({ error: "Invalid field", message: `Invalid field: ${field}` });
            }
        }

        // Field-specific validation
        if (phone && (!USPhoneNo.test(phone) || !internationalPhoneNo.test(phone))) {
            console.error("Invalid phone number format.");
            return res.status(400).json({ error: "Invalid Phone Number", message: "Invalid phone number format." });
        }
        if (isApproved && typeof isApproved !== "boolean") {
            console.error("'isApproved' should be a boolean.");
            return res.status(400).json({ error: "Invalid Data Type", message: "'isApproved' should be a boolean." });
        }
        if (email) {
            const existingUser = await user.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists", message: "A user with this email already exists." });
            }

            // Handle Email Verification
            sendVerificationEmail(newUser, res).catch(error => {
                console.error("Error sending verification email : ", error);
                return res.status(500).json({ error: "Verification email was not sent due to an error.", details: error.message });
            });
        }
        if (securityAnswer) {
            const salt = await bcrypt.genSalt(10);
            securityAnswer = await bcrypt.hash(securityAnswer, salt);
        }


        // Prepare update data
        let userNewData = {};
        if (name) userNewData.name = name;
        if (phone) userNewData.phone = phone;
        if (email) userNewData.email = email;
        if (isApproved !== undefined) userNewData.isApproved = isApproved;
        if (securityQuestion) userNewData.securityQuestion = securityQuestion;
        if (securityAnswer) userNewData.securityAnswer = securityAnswer;

        // Role-specific validation and updates
        if (userUpdater.role === "Super admin") {
            if (userToUpdate.role === "Super admin") {
                return res.status(401).json({ error: "Not allowed", message: "Cannot update Super admin." });
            }
            if (role) {
                const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                if (["Admin", "Manager", "User"].includes(formattedRole)) {
                    userNewData.role = formattedRole;
                } else {
                    console.error("Invalid role:", role);
                    return res.status(400).json({ error: "Invalid role", message: "Invalid role specified." });
                }
            }
        } else if (userUpdater.role === "Admin") {
            if (["Super admin", "Admin"].includes(userToUpdate.role)) {
                console.error("Admin cannot update Super admin or other Admins.");
                return res.status(403).json({ error: "Forbidden", message: "You are not authorized to update Super admin or Admin roles." });
            }
            if (role) {
                const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                if (["Manager", "User"].includes(formattedRole)) {
                    userNewData.role = formattedRole;
                } else {
                    console.error("Invalid role:", role);
                    return res.status(400).json({ error: "Invalid role", message: "Invalid role specified." });
                }
            }
        } else if (userUpdater.role === "Manager") {
            if (userToUpdate.role !== "User") {
                console.error("Manager cannot update Super admin, Admin or other Manager.");
                return res.status(403).json({ error: "Forbidden", message: "You are not authorized to update other than User." });
            }
            if (role) {
                const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                if (formattedRole !== "User") {
                    console.error("Manager cannot assign roles other than User.");
                    return res.status(403).json({ error: "Forbidden", message: "You are not authorized to assign roles other than User." });
                }
                userNewData.role = formattedRole;
            }
        } else if (userToUpdateId !== userUpdaterId) {
            console.error("Unexpected Issue: You are not authorized to update this user.");
            return res.status(400).json({ error: "Unexpected error", message: "You are not authorized to update this user." });
        }

        // Perform update
        const updatedUser = await user.findByIdAndUpdate(userToUpdateId, { $set: userNewData }, { new: true });

        // Respond with updated user data
        return res.status(200).json({ message: "User data updated successfully", updatedData: updatedUser });
    } catch (error) {
        console.error("Internal server error:", error.message);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}