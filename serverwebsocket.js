const express = require("express");
const { WebSocketServer } = require("ws");
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();


// Connecting database
const connectToMongo = async () => {
    try {
        if (!process.env.MONGO_DB_NAME) {
            console.log("May be database name is not exist, Check the .env file");
        } else {
            await mongoose.connect(process.env.MONGO_DB_NAME, {})
            console.log("Connected MongoDB");
        }
    } catch (error) {
        console.error('Could not connect with database, Server error : ', error);
    }
}
connectToMongo();

// Server listening
const app = express();
const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});


// Camera status model
const cameraStatusSchema = new Schema({
    cameraId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    lastStatus: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

    // Notification area provide this information at frontend side
    notifications: [{
        type: new Schema({
            timestamp: {
                type: Date,
                default: Date.now
            },
            message: {
                type: String,
                required: true
            }
        })
    }]
});
const CameraStatus = mongoose.model('CameraStatus', cameraStatusSchema);


// Add WebSocket Server
const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
    console.log('Client connected');

    CameraStatus.find({})
        .then(status => {
            ws.send(JSON.stringify(status));
        })
        .catch(err => {
            console.error(err);
            ws.send(JSON.stringify({ error: "Error fetching camera status" }));
        });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to broadcast the given status to all connected WebSocket clients
const broadcastStatus = (status) => {
    wss.clients.forEach(client => {
        // Client is ready to receive messages
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(status));
        }
    });
};

// Updating database
const updateCameraStatus = async (newStatus) => {
    try {
        const cameraId = "CAM001"; // Example cameraId
        let cameraStatus = await CameraStatus.findOne({ cameraId });

        if (!cameraStatus) {
            cameraStatus = new CameraStatus({
                cameraId,
                status: newStatus,
                lastStatus: 'Offline',
                notifications: []
            });
        } else {
            let notificationMessage;
            if (cameraStatus.status === 'Online' && newStatus === 'Offline') {
                notificationMessage = `Camera ${cameraId} went offline.`;
            } else if (cameraStatus.status === 'Offline' && newStatus === 'Online') {
                notificationMessage = `Camera ${cameraId} went online.`;
            }

            if (notificationMessage) {
                const notification = {
                    timestamp: new Date(),
                    message: notificationMessage
                };
                cameraStatus.notifications.push(notification);
                broadcastStatus(notification);
            }

            cameraStatus.lastStatus = cameraStatus.status;
            cameraStatus.status = newStatus;
        }

        await cameraStatus.save();
        const updatedStatus = await CameraStatus.find();
        // broadcastStatus(updatedStatus);
    } catch (err) {
        console.error("Failed to update camera status", err);
    }
};

// Interate within 5 second
setInterval(() => {
    const newStatus = Math.random() > 0.5 ? 'Online' : 'Offline';
    updateCameraStatus(newStatus);
}, 5000);