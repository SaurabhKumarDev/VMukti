const router = require('express').Router();
const { body } = require('express-validator');
const fetchUser = require("../middlewares/fetchUser");
const sessionHandler = require('../middlewares/session');

// Importing controllers
const registerController = require('../controllers/user/registerController');
const loginController = require('../controllers/user/loginController');
const fetchController = require('../controllers/user/fetchUserController');
const updateController = require('../controllers/user/updateController');
const forgetPassword = require('../controllers/user/passwordForgetController');
const { selfAccountDeletion, adminRemoveUser } = require('../controllers/user/deleteController');
const { allLogedInDevice, ownLoginDevice } = require('../controllers/user/checkDeviceLoggedInController');
const { adminLogOut, userLogout } = require('../controllers/user/userLogoutController');

// Register
router.post('/register', [
    body('name').notEmpty().trim().isLength({ min: 3 }).withMessage("Name should be at least 3 characters long"),
    body('phone').notEmpty().trim().isLength({ min: 10 }).withMessage("Phone should be at least 10 characters long"),
    body('email').notEmpty().trim().normalizeEmail().isEmail().withMessage("Incorrect Email"),
    body('password').notEmpty().trim().isLength({ min: 8 }).withMessage("Password should be at least 8 characters long"),
    body('securityQuestion').optional().trim().isLength({ min: 3 }).withMessage("Security question should be at least 3 characters long"),
    body('securityAnswer').optional().trim().isLength({ min: 3 }).withMessage("Security answer should be at least 3 characters long")
], registerController);

// Login
router.post('/login', [
    body('email').notEmpty().trim().isEmail().normalizeEmail().withMessage("Enter a correct email"),
    body('password').notEmpty().trim().withMessage("Password should be strong")
], loginController);

// Fetch user
router.get('/fetch', fetchUser, sessionHandler, fetchController);

// Update user by admin & Own
router.put('/update/:id', fetchUser, sessionHandler, [
    body("name").optional().isLength({ min: 3 }).withMessage("Name length should be at least 3 characters"),
    body("email").optional().isEmail().withMessage("Enter a valid email"),
    body("role").optional().trim(),
    body("securityQuestion").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security question"),
    body("securityAnswer").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security answer")
], updateController);

// Forgot Password
router.patch('/forget', [
    body('email').notEmpty().trim().isEmail().withMessage("Enter correct email address"),
    body("securityQuestion").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security question"),
    body("securityAnswer").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security answer")
], forgetPassword);

// Delete user account by admin
router.delete('/delete/:id', fetchUser, sessionHandler, adminRemoveUser);

// Delete user account by user
router.delete('/delete', fetchUser, sessionHandler, selfAccountDeletion);

// All logged-in devices for the super admin
router.get('/all/loginfo/:id', fetchUser, sessionHandler, allLogedInDevice);

// Specific user checks their own logged-in devices
router.get('/loginfo', fetchUser, sessionHandler, ownLoginDevice);

// Log out by the user where multiple devices are logged in using their credentials
router.get('/logout', fetchUser, sessionHandler, userLogout);

// Logging out via super admin to any device
router.get('/admin/logout/:id', fetchUser, sessionHandler, adminLogOut);

module.exports = router;