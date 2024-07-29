const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the CameraStatus schema
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
        enum: ["Online","Offline"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
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

// Create a model from the schema
const CameraStatus = mongoose.model('CameraStatus', cameraStatusSchema);

module.exports = CameraStatus;
