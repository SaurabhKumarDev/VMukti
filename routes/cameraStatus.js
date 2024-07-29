const express = require('express');
const router = express.Router();
const CameraStatus = require('../models/cameraStatus');
const FetchUser = require('../middlewares/fetchUser')
const Camera = require('../models/cammera')
const UserInfo = require('../models/user')
const { WebSocketServer } = require('ws')

// Route to create or update camera status
router.post('/update-camera-status', async (req, res) => {
    try {
        const { cameraId } = req.body;

        // Check camera exist
        const isCameraExist = await Camera.find({ cameraid: cameraId });
        if (!isCameraExist) {
            console.log("Soory, this camera is not exist so you could not update this data");
            return res.status(204).json({ error: "Not exist", message: "Sory camera is not exist so you could not update the status of the camera" })
        }

        // Validate input
        if (!cameraId) {
            return res.status(400).json({ message: 'Camera ID required.' });
        }

        // Check if camera status exists
        let cameraStatus = await CameraStatus.findOne({ cameraId });



        // Add PORT
        const wss = new WebSocketServer ({port:8080})


        wss.on('connection', ws => {
            console.log('Client connected');

            CameraStatus.find().then(status => {
                ws.send(JSON.stringify(status));
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });

        const broadcastStatus = (status) => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(status));
                }
            });
        };

        const updateCameraStatus = async (newStatus) => {
            try {
                await Status.deleteMany({});
                const status = new Status({ isCameraWork: newStatus });
                await status.save();
                const updatedStatus = await Status.find();
                broadcastStatus(updatedStatus);
            } catch (err) {
                console.error("Failed to update camera status", err);
            }
        };

        setInterval(() => {
            const newStatus = Math.random() > 0.5 ? 'online' : 'offline';
            updateCameraStatus(newStatus);
        }, 5000);






        if (cameraStatus) {
            // Update existing camera status
            cameraStatus.status = status;
            cameraStatus.lastStatusChange = Date.now();

            // Add a notification
            cameraStatus.notifications.push({
                message: `Camera : ${cameraId} is now ${status}.`
            });
        } else {
            // Create new camera status
            cameraStatus = new CameraStatus({
                cameraId,
                status,
                lastStatusChange: Date.now()
            });
        }

        // Save the camera status
        await cameraStatus.save();

        // Send response
        console.log(`Camera stutus for ${cameraId} has been updated to ${status}`);
        res.status(200).json({
            message: `Camera status for ${cameraId} has been updated to ${status}.`,
            cameraStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/camera-status/:cameraID', FetchUser, async (req, res) => {
    try {
        const { cameraID } = req.params;
        const userId = req.User;

        // Check if the user exists
        const user = await UserInfo.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the camera exists for the user
        const camera = await Camera.findOne({ cameraid: cameraID, user: userId });
        if (!camera) {
            console.log("Camera not found for the user");
            return res.status(404).json({ message: `No camera found with ID ${cameraID}` });
        }

        // Get all statuses of the camera
        const allStatuses = await CameraStatus.find({ cameraId: cameraID });

        console.log("Complete status of the camera:", allStatuses);
        return res.status(200).json({
            message: "Successfully fetched the status of the camera",
            status: allStatuses
        });
    } catch (error) {
        console.error("Server error:", error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router