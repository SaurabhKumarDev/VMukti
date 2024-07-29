const mongoose = require("mongoose");
const { Schema } = mongoose;

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
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours
        }
    }
});

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);