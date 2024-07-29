const express = require('express');
const router = express.Router();
const camera = require('../models/cammera');
const user = require('../models/user');
const fetchedUser = require('../middleware/fetchUser');

// Add camera
router.post('/add', fetchedUser, async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            console.error("Unexpected error occure, login again");
            return res.status(500).json({ error: "Internal server error", message: "Unexpected error occured", detail: "Login again", support: "Contact support team" });
        }

        // Check the request body
        if (Object.keys(req.body).length===0) {
            console.log("Request body is empty");
            return res.status(400).json({error: "Request body is empty", message:"Add camera detail for adding"})
        }

        // Destructuring
        const { cameraid, customerid, cameraname, cameraurl, deviceid, is360, isfhd, islive, isnumplate, isptz, plandays, plandisplayname, planname, streamname } = req.body;

        // Checking cammera already exist or not
        const cameraExist = await camera.findOne({ cameraid: cameraid });
        if (cameraExist) {
            console.log("Camera already exist");
            return res.status(409).json({ error: "Camera with the same ID already exists." })
        }

        // Should be not enter userDetail manully
        if (req.body.user || req.body.createdDate) {
            console.log(`Entry for this field not allowed : user & created-date`);
            return res.status(400).json({error: "User & CreatedDate field entry",message: "Not allowed entry for this field"});
        }

        // Adding the camera detail
        await camera.create({
            user: req.User,
            cameraid: cameraid,
            customerid: customerid,
            cameraname: cameraname,
            cameraurl: cameraurl,
            deviceid: deviceid,
            is360: is360,
            isfhd: isfhd,
            islive: islive,
            isnumplate: isnumplate,
            isptz: isptz,
            plandays: plandays,
            plandisplayname: plandisplayname,
            planname: planname,
            streamname: streamname
        })

        // Result
        console.log("New camera detail added");
        return res.status(201).json({ message: "Camera added successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occur while adding the new camera", error: "Internal server error", detail: error.message });
    }
})

// Fetch all camera
router.get('/fetch/all', fetchedUser, async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            console.error("Unexpected error occure, login again");
            return res.status(500).json({ error: "Internal server error", message: "Unexpected error occured", detail: "Login again", support: "Contact support team" });
        }

        if (isUserExist.role === "Super admin") {
            // Camera details
            const cameras = await camera.find({});

            // Check camera exist
            if (Object.keys(cameras).length === 0) {
                console.log("Currently there is no camera available");
                return res.status(404).json({ error: "No camera available" });
            }

            // Result
            console.log(`Camera details fetched by ${isUserExist.name}`);
            res.status(200).json({ message: "All camera fetched", user: isUserExist.name, camera: { total_camera: Object.keys(cameras).length, camera_detail: cameras } });
        } else {
            console.log("Permission denied");
            return res.status(403).json({ error: "Forbidden", message: "You do not have suffiecient permission to access all the cameras" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

// Fetch camera 
router.get('/fetch', fetchedUser, async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            console.error("Unexpected error occure, login again");
            return res.status(500).json({ error: "Internal server error", message: "Unexpected error occured", detail: "Login again", support: "Contact support team" });
        }

        // Fetch camera
        const cameraExist = await camera.find({ user: isUserExist.id });

        // Check camera exist
        if (Object.keys(cameraExist).length === 0) {
            console.log("Sorry, there is no camera available for this user, or they have not purchased a camera");
            return res.status(404).json({ error: "No content", message: "Camera doesn't exist[" })
        }

        // Output
        console.log(`Camera details fetched`);
        return res.status(200).json(cameraExist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

router.get('/fetch/:cameraId', fetchedUser, async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            console.error("Unexpected error occure, login again");
            return res.status(500).json({ error: "Internal server error", message: "Unexpected error occured", detail: "Login again", support: "Contact support team" });
        }

        try {
            // Fetch camera
            const isCamera = await camera.find({ cameraid: req.params.cameraId, user: isUserExist._id })

            // Check camera exist
            if (Object.keys(isCamera).length === 0) {
                console.log("Camera is not available");
                return res.status(404).json({ error: "No content", message: "Camera doesn't exist" })
            }

            console.log("Your camera : ", isCamera);
            return res.status(200).json({ message: "Camera fetched successfully", camera : isCamera });
        } catch (error) {
            console.error(`Some error occured while fetching the camera : ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

module.exports = router;