const mongoose = require("mongoose");
const { Schema } = mongoose;
require('dotenv').config();

const emailVerificationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    uniqueString: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function () {
            return new Date(Date.now() + ((process.env.EMAIL_EXPIRE_MIN || 10) * 60 * 1000)); // Expires in 24 hours
        }
    }
});

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);