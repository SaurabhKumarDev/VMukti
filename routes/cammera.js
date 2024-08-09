const router = require('express').Router();
const fetchedUser = require('../middlewares/fetchUser');
const sessionHandler = require('../middlewares/session');
const { adminAccessedCameraDetail, userCameraDetail, adminFetchedCameraByUserId, fetchCameraViaURL } = require('../controllers/camera/getCamera');
const addCamera = require('../controllers/camera/addCamera');

// Add camera
router.post('/add/:customerid', fetchedUser, sessionHandler, addCamera);

// Fetch all camera by super admin
router.get('/all/fetch', fetchedUser, sessionHandler, adminAccessedCameraDetail)

// Fetch camer using user id
router.get('/all/fetch/:userID', fetchedUser, sessionHandler, adminFetchedCameraByUserId);

// Fetch camera by user
router.get('/fetch', fetchedUser, sessionHandler, userCameraDetail);

// Fetch URL Camera details
router.get('/fetch/url', fetchedUser, sessionHandler, fetchCameraViaURL);

module.exports = router;