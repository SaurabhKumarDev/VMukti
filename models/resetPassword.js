const mongoose = require("mongoose");
const { Schema } = mongoose;

const resetPassword = new Schema({
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
            return new Date(Date.now() + (process.env.EMAIL_EXPIRE_MIN || 10) * 60 * 1000); 
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('resetPassword', resetPassword);