import { WebSocketServer } from "ws";
import express from "express";
import cameraSchema from "../models/cameraStatus"

import mongoose from "mongoose";
// import { server } from "./config/server"; // Assuming the server is exported from a config file


const app = express();

// Create a new WebSocket server
const server = app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
const wss = new WebSocketServer({ server });




// Define the status schema
// const statusSchema = new mongoose.Schema({
//     isCameraWork: {
//         type: String,
//         default: "Offline",
//         enum: ['Online', 'Offline'],
//     }
// });

// Create the Status model
// const Status = mongoose.model('Status', statusSchema);

// Set up WebSocket server


wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send initial status to the connected client
    Status.find().then((status) => {
        ws.send(JSON.stringify(status));
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Broadcast the updated status to all connected clients
const broadcastStatus = (status) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(status));
        }
    });
};

// Update camera status and broadcast it
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

// Update status every 5 seconds
setInterval(() => {
    const newStatus = Math.random() > 0.5 ? 'Online' : 'Offline';
    updateCameraStatus(newStatus);
}, 5000);