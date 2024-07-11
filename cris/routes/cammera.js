const express = require('express');
const router = express.Router();
const camera = require('../models/cammera');
const user = require('../models/user');
const fetchedUser = require('../middleware/fetchUser');

// Adding the camera detail
router.post('/add', fetchedUser, async (req, res) => {
    try {
        // Destructuring
        const { cameraid, customerid, cameraname, cameraurl, createdDate, deviceid, is360, isfhd, islive, isnumplate, isptz, plandays, plandisplayname, planname, streamname } = req.body;

        // Checking cammera already exist or not
        const cameraExist = await camera.findOne({ cameraid: cameraid });
        if (cameraExist) {
            console.log("Camera already exist");
            return res.status(409).json({ error: "Camera with the same ID already exists." })
        }

        // Adding the camera detail
        await camera.create({
            user: req.User,
            cameraid: cameraid,
            customerid: customerid,
            cameraname: cameraname,
            cameraurl: cameraurl,
            createdDate: createdDate,
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
        res.status(500).json({ error: "Some error occur while adding the new camera to our database", message: "Internal server error" });
    }
})

// Fetch all camera via user id
router.get('/fetch', fetchedUser, async (req, res) => {
    try {
        // Camera details
        const cameras = await camera.find({ user: req.User });

        // Check if user has any cameras
        if (Object.keys(cameras).length === 0) {
            console.log("Sorry, there is no camera available for this user, or they have not purchased a camera");
            return res.status(404).json({ error: "No camera available", message: "Sorry, this user does not have a camera, or they have not purchased one." })
        }

        // Accessing user detail
        const findingUser = await user.findOne({ _id: req.User });

        // Result
        console.log("All cammera fetched : ", findingUser.email);
        res.status(200).json({ message: "All camera fetched", user: findingUser.email, camera: { total_camera: Object.keys(cameras).length, camera_detail: cameras } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

// Fetch using cameraid {params}
router.get('/fetch/:cameraid', fetchedUser, async (req, res) => {
    try {
        const cameraExist = await camera.findOne({ cameraid: req.params.cameraid });

        // Checking the camera exist or not
        if (!cameraExist) {
            console.log("Camera does not exist");
            return res.status(404).json({ error: "No Content", message: "Camera doesn't exist" });
        }

        // Output
        console.log(`Camera details fetched`);
        return res.status(200).json(cameraExist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
})

module.exports = router;