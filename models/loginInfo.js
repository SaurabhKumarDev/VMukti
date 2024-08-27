const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginInfoSchema = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    browser: { 
        type: String, 
        required: true ,
        default: "Chrome"
    },
    platform: { 
        type: String, 
        required: true,
        default: "Linux"
    },
    public_ip: { 
        type: String, 
        required: true,
        default: "188.123.1.0"
    },
    private_ip: { 
        type: String, 
        required: true,
        default: "192.168.1.49"
    },
    session_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    address: {
        type: String,
        required: true,
        default: "India"
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: { 
        type: String, 
        enum: ['Active', 'Not Active'], 
        required: true 
    },
    login_time: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    logout_time: { 
        type: Date 
    }
});

module.exports = mongoose.model('LoginInfo', LoginInfoSchema);