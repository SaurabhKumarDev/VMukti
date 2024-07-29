const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({

    // SignUp : First page
    name: {
        type: String,
        required: true,
        trim:true  
    },
    phone: {
        type: Number,
        required: true,
        trim:true
    },
    role: {
        type:String,
        default: "User",
        required:true,
        trim:true 
    },
    email: {
        type:String,
        required:true,
        unique: true,
        trim:true
    },
    password: {
        type:String,
        required:true,
        trim:true
    },
    date: {
        type: Date,
        default: Date.now
    },

    // Account active ?
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    
    // SignUP : Second page
    securityQuestion: {
        type: String,
        trim: true
    },
    securityAnswer: {
        type: String,
        trim: true
    },

    // Check either data verified
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },

    
    lastLogin: {
        type: Date
    },
    
    // If password is wrong entered 3 times, Lock. 
    // 3rd time password was correct than loginAttempt set 0  
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    // Lock untill 24 Hour
    lockUntil: {
        type: Number
    },
})

module.exports = mongoose.model('User', userSchema);