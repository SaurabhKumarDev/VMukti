const router = require('express').Router();
const fetchedUser = require('../middlewares/fetchUser');
const { adminAccessedCameraDetail, userCameraDetail, adminFetchedCameraByUserId, fetchCameraViaURL } = require('../controllers/camera/getCamera');
const addCamera = require('../controllers/camera/addCamera');

// Add camera
router.post('/add', fetchedUser, addCamera);

// Fetch all camera by super admin
router.get('/all/fetch', fetchedUser, adminAccessedCameraDetail)

// Fetch camer using user id
router.get('/all/fetch/:userID', fetchedUser, adminFetchedCameraByUserId);

// Fetch camera by user
router.get('/fetch', fetchedUser, userCameraDetail);

// Fetch URL Camera details
router.get('/fetch/url', fetchedUser, fetchCameraViaURL);

module.exports = router;