// const router = require('express').Router();
// const { body } = require('express-validator');
// const fetchUser = require("../middlewares/fetchUser");
// require('dotenv').config();


// // Importing controller
// const registerController = require('../controllers/user/registerController')

// // Register
// router.post('/register', [
//     body('name').notEmpty().trim().isLength({ min: 3 }).withMessage("Name should be at least 3 characters long"),
//     body('phone').notEmpty().trim().isLength({ min: 10 }).withMessage("Phone should be at least 10 characters long"),
//     body('email').notEmpty().trim().normalizeEmail().isEmail().withMessage("Incorrect Email"),
//     body('password').notEmpty().trim().isLength({ min: 8 }).withMessage("Password should be at least 8 characters long"),
//     body('securityQuestion').optional().trim().isLength({ min: 3 }).withMessage("Security question should be at least 3 characters long"),
//     body('securityAnswer').optional().trim().isLength({ min: 3 }).withMessage("Security answer should be at least 3 characters long")
// ],
//     registerController
// )


// // Importint login controller
// const loginController = require('../controllers/user/loginController')

// // Login
// router.post('/login',
//     [
//         body('email').notEmpty().trim().isEmail().normalizeEmail().withMessage("Enter a correct email"),
//         body('password').notEmpty().trim().isStrongPassword().withMessage("Password should be strong")
//     ],
//     loginController
// );


// // Importing fetch controller
// const fetchController = require('../controllers/user/fetchUserController')

// // Fetch
// router.get('/fetch', fetchUser, fetchController);


// // Import update controller
// const updateController = require('../controllers/user/updateController')

// // Update user
// router.put('/update/:id', fetchUser,
//     [
//         body("name").optional().isLength({ min: 3 }).withMessage("Name length should be at least 3 characters"),
//         body("email").optional().isEmail().withMessage("Enter a valid email"),
//         body("role").optional().trim(),
//         body("securityQuestion").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security question"),
//         body("securityAnswer").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security answer"),
//     ], updateController
// );


// // Import password forget
// const forgetPassword = require('../controllers/user/passwordForgetController')

// // Forgot Password
// router.patch('/forget',
//     [
//         body('email').notEmpty().trim().isEmail().withMessage("Enter correct email address"),
//         body("securityQuestion").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security question"),
//         body("securityAnswer").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security answer"),
//     ], forgetPassword);


// // Importing the delete user
// const deleteUser = require('../controllers/user/deleteController')

// // Deleting the user
// router.delete('/delete/:id', fetchUser, deleteUser);


// // Import all loggedin user with device for the super admin
// const { allLogedInDevice } = require('../controllers/user/checkDeviceLoggedInController')

// // Login info
// router.get('/loginfo', fetchUser, allLogedInDevice);


// // Specific user check their own looged in devices
// const { OwnLoginDevice } = require('../controllers/user/checkDeviceLoggedInController');

// router.get('/loginfo/:id', fetchUser, OwnLoginDevice);


// // Logging out via super admin to any device
// const { adminLogOut } = require('../controllers/user/userLogoutController');

// router.delete('/logout/:id', fetchUser, adminLogOut);



// // log out by the user where multiple device logging in usingg their credentials
// const { userlogout } = require('../controllers/user/userLogoutController');

// router.post('/logout', sessionHandler, userlogout);


// module.exports = router;







const router = require('express').Router();
const { body } = require('express-validator');
const fetchUser = require("../middlewares/fetchUser");
// require('dotenv').config();

// Importing controllers
const registerController = require('../controllers/user/registerController');
const loginController = require('../controllers/user/loginController');
// const fetchController = require('../controllers/user/fetchUserController');
// const updateController = require('../controllers/user/updateController');
// const forgetPassword = require('../controllers/user/passwordForgetController');
// const deleteUser = require('../controllers/user/deleteController');
// const { allLoggedInDevice, ownLoginDevice } = require('../controllers/user/checkDeviceLoggedInController');
const { adminLogOut, userLogout } = require('../controllers/user/userLogoutController');
const sessionHandler = require('../middlewares/session');

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

// Log out by the user where multiple devices are logged in using their credentials
router.post('/logout', fetchUser, sessionHandler, userLogout);

// // Fetch user
// router.get('/fetch', fetchUser, fetchController);

// // Update user
// router.put('/update/:id', fetchUser, [
//     body("name").optional().isLength({ min: 3 }).withMessage("Name length should be at least 3 characters"),
//     body("email").optional().isEmail().withMessage("Enter a valid email"),
//     body("role").optional().trim(),
//     body("securityQuestion").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security question"),
//     body("securityAnswer").optional().trim().isLength({ min: 3 }).withMessage("Enter a valid security answer")
// ], updateController);

// // Forgot Password
// router.patch('/forget', [
//     body('email').notEmpty().trim().isEmail().withMessage("Enter correct email address"),
//     body("securityQuestion").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security question"),
//     body("securityAnswer").notEmpty().trim().isLength({ min: 3 }).withMessage("Enter correct security answer")
// ], forgetPassword);

// // Delete user
// router.delete('/delete/:id', fetchUser, deleteUser);

// // All logged-in devices for the super admin
// router.get('/loginfo', fetchUser, allLoggedInDevice);

// // Specific user checks their own logged-in devices
// router.get('/loginfo/:id', fetchUser, ownLoginDevice);

// // Logging out via super admin to any device
// router.delete('/logout/:id', fetchUser, adminLogOut);



module.exports = router;