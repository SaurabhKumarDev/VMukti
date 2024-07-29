// const user = require('../../models/user')
// const {validationResult} = require('express-validator')

// module.exports = async (req, res) => {
//         try {
//             const userToUpdateId = req.params.id;
//             const userUpdaterId = req.User;

//             // Check the fetchedUser
//             const userUpdater = await user.findById(userUpdaterId);
//             if (!userUpdater) {
//                 console.log("User updater may be deleted. Retry login or contact support. Unexpected error occurred");
//                 return res.status(404).json({ error: "User updater may be deleted", message: "Retry login or contact support" })
//             }

//             // Update this user
//             const userToUpdate = await user.findById(userToUpdateId);
//             if (!userToUpdate) {
//                 console.log("Which user do you want to update? The user might have deleted their account.");
//                 return res.status(404).json({ error: "Which user do you want to update?", message: "The user might have deleted their account" });
//             }

//             // Check if req.body is empty
//             if (Object.keys(req.body).length === 0) {
//                 console.error("Request body is empty. Provide data to update");
//                 return res.status(400).json({ error: "Bad Request", message: "Request body is empty. Provide data to update." });
//             }

//             const { name, phone, email, role, isApproved, securityQuestion, securityAnswer, loginAttempts } = req.body;

//             // Validating
//             const checkingValidation = validationResult(req);
//             if (!checkingValidation.isEmpty()) {
//                 console.log(checkingValidation.errors);
//                 return res.status(400).json({ error: checkingValidation.errors });
//             }

//             // Validate the request body for allowed fields only
//             const allowedFields = ["name", "phone", "role", "isApproved", "securityQuestion", "securityAnswer", "loginAttempts", "email"];
//             for (const field in req.body) {
//                 if (!allowedFields.includes(field)) {
//                     console.log("Invalid field of data you are trying to pass");
//                     return res.status(400).json({ error: "Invalid field of data you are trying to pass", invalidField: `${field}` });
//                 }
//             }

//             // Checking fields    
//             if (phone) {
//                 if (!USPhoneNo.test(phone) || !internationalPhoneNo.test(phone)) {
//                     console.error("Invalid phone number format. Please provide a valid phone number.");
//                     return res.status(400).json({ error: "Invalid Phone Number", message: "Invalid phone number format. Please provide a valid phone number" });
//                 }
//             }
//             if (isApproved) {
//                 if (typeof isApproved !== "boolean") {
//                     console.error("DataType error : 'isApproved' should be a boolean.");
//                     return res.status(400).json({ error: "Invalid Data Type", message: "'isApproved' should be a boolean" })
//                 }
//             }
//             if (email) {
//                 const userExist = await user.findOne({ email: email });
//                 if (userExist) {
//                     console.error("A user already exists with this email. Please try a different email");
//                     return res.status(400).json({ error: "User already exist", message: "A user already exists with this email. Please try a different email" })
//                 }
//             }

//             // Create an object to hold the fields to be update
//             let userNewData = {};

//             console.log(userToUpdate);
//             // Data update according to their role
//             if (userUpdater.role === "Super admin") {
//                 if (userToUpdate.role === "Admin" || userToUpdate.role === "Manager" || userToUpdate.role === "User" || userToUpdateId === userUpdaterId) {
//                     if (name) userNewData.name = name;
//                     if (phone) userNewData.phone = phone;
//                     if (email) userNewData.email = email;
//                     if (isApproved) userNewData.isApproved = isApproved;
//                     if (securityQuestion) userNewData.securityQuestion = securityQuestion;
//                     if (securityAnswer) userNewData.securityAnswer = securityAnswer;
//                     if (loginAttempts) userNewData.loginAttempts = loginAttempts;

//                     if (role) {
//                         if (userToUpdateId === userUpdaterId) {
//                             console.log("You are not allowed to change your own role.");
//                             return res.status(403).json({ error: "Forbidden", message: "You are not allowed to change your own role." })
//                         }
//                         let storeRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//                         storeRole = storeRole.trim();
//                         if (storeRole === "Admin" || storeRole === "Manager" || storeRole === "User") {
//                             userNewData.role = storeRole;
//                         } else if (storeRole === "Super admin") {
//                             console.log("Sorry, you can't make yourself a 'Super Admin");
//                             return res.status(400).json({ error: "This role is not allowed to take", message: "Soory, you can't make yourself a 'Super Admin'" });
//                         } else {
//                             console.error("Invalid role, Please enter correct role");
//                             return res.status(400).json({ error: "Invalid role", message: "You have only 4 role's to define the uer role" });
//                         }
//                     }
//                 } else if (userToUpdate.role === "Super admin") {
//                     console.log("You are not allowed to manipulate this information");
//                     return res.status(401).json({ error: "Not allowed", message: "Contact support" });
//                 } else {
//                     console.error("Unexpected Issue");
//                     return res.status(400).json({ error: "Unexpected error occur", message: "Which user you want to update, role issue occur on that" })
//                 }
//             } else if (userUpdater.role === "Admin") {
//                 if (userToUpdate.role === "Manager" || userToUpdate.role === "User" || userToUpdateId === userUpdaterId) {
//                     if (name) userNewData.name = name;
//                     if (phone) userNewData.phone = phone;
//                     if (email) userNewData.email = email;
//                     if (isApproved) userNewData.isApproved = isApproved;
//                     if (securityQuestion) userNewData.securityQuestion = securityQuestion;
//                     if (securityAnswer) userNewData.securityAnswer = securityAnswer;
//                     if (loginAttempts) userNewData.loginAttempts = loginAttempts;

//                     if (userToUpdateId === userUpdaterId) {
//                         if (isApproved || loginAttempts || role) {
//                             console.log("You are not authorized to change some data");
//                             return res.status(403).json({ error: "Not able to change some data" });
//                         }
//                     }

//                     if (role) {
//                         let storeRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//                         storeRole = storeRole.trim();
//                         if (storeRole === "Manager" || storeRole === "User") {
//                             userNewData.role = storeRole;
//                         } else if (storeRole === "Super admin" || storeRole === "Admin") {
//                             console.log("Permission denied");
//                             return res.status(400).json({ error: "Permission denied", message: "You are not authorized to change it" })
//                         } else {
//                             console.error("Invalid role, Please enter correct role");
//                             return res.status(400).json({ error: "Invalid role", message: "You have only 4 role's to define the uer role" });
//                         }
//                     }
//                 } else if (userToUpdate.role === "Super admin" || userToUpdate.role === "Admin") {
//                     console.log("Permission denied");
//                     return res.status(400).json({ error: "Permission denied", message: "You are not authorized to change it" })
//                 } else {
//                     console.error("Unexpected Issue");
//                     return res.status(400).json({ error: "Unexpected error occur", message: "Which user you want to update, role issue occur on that" })
//                 }
//             } else if (userUpdater.role === "Manager") {
//                 if (userToUpdate.role === "User" || userToUpdateId === userUpdaterId) {
//                     if (name) userNewData.name = name;
//                     if (phone) userNewData.phone = phone;
//                     if (email) userNewData.email = email;
//                     if (isApproved) userNewData.isApproved = isApproved;
//                     if (securityQuestion) userNewData.securityQuestion = securityQuestion;
//                     if (securityAnswer) userNewData.securityAnswer = securityAnswer;
//                     if (loginAttempts) userNewData.loginAttempts = loginAttempts;

//                     if (userToUpdateId === userUpdaterId) {
//                         if (isApproved || loginAttempts || role) {
//                             console.log("You are not authorized to change some data");
//                             return res.status(403).json({ error: "Not able to change some data" });
//                         }
//                     }

//                     if (role) {
//                         let storeRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//                         storeRole = storeRole.trim();
//                         if (storeRole === "User") {
//                             userNewData.role = storeRole;
//                         } else if (storeRole === "Super admin" || storeRole === "Admin" || storeRole === "Manager") {
//                             console.log("Permission denied");
//                             return res.status(400).json({ error: "Permission denied", message: "You are not authorized to change it" })
//                         } else {
//                             console.error("Invalid role, Please enter correct role");
//                             return res.status(400).json({ error: "Invalid role", message: "You have only 4 role's to define the uer role" });
//                         }
//                     }
//                 } else {
//                     console.error("Unexpected Issue");
//                     return res.status(400).json({ error: "Unexpected error occur", message: "Which user you want to update, role issue occur on that" })
//                 }
//             } else if (userUpdaterId === userToUpdateId) {
//                 if (name) userNewData.name = name;
//                 if (phone) userNewData.phone = phone;
//                 if (email) userNewData.email = email;
//                 if (securityQuestion) userNewData.securityQuestion = securityQuestion;
//                 if (securityAnswer) userNewData.securityAnswer = securityAnswer;
//             } else {
//                 console.error("Unexpected Issue");
//                 return res.status(400).json({ error: "Unexpected error occur", message: "Which user you want to update, role issue occur on that" })
//             }

//             // Update user data
//             let newEntry = await user.findByIdAndUpdate(userToUpdateId, { $set: userNewData }, { new: true });

//             // Result if successfully updated
//             console.log(`User data updated : ${newEntry.email}`);
//             return res.status(200).json({ message: "User data is updated successfully", updatedData: userNewData });
//         } catch (error) {
//             console.error("Internal server error : ", error.message);
//             res.status(500).json({ error: "Internal Server Error", message: error.message });
//         }
//     }






const user = require('../../models/user');
const { validationResult } = require('express-validator');
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
        const allowedFields = ["name", "phone", "role", "isApproved", "securityQuestion", "securityAnswer","email"];
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
            if (role && userToUpdate.role !== "User" && userToUpdateId !== userUpdaterId) {
                console.error("Manager cannot update roles.");
                return res.status(403).json({ error: "Forbidden", message: "You are not authorized to update roles other than User." });
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
        console.log(`User data updated: ${updatedUser.email}`);
        return res.status(200).json({ message: "User data updated successfully", updatedData: updatedUser });
    } catch (error) {
        console.error("Internal server error:", error.message);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
