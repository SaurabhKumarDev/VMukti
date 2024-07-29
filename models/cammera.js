const mongoose = require('mongoose');
const { Schema } = mongoose;

const cammeraSchema = new Schema({
    user: {
        // This field store the special type of objectID used by the mongoose
        // type: mongoose.Schema.Types.ObjectId,
        // The ref property specifies which model this ObjectId refers to. In this case, it references the User model. This creates a relationship between the current model and the User model, enabling Mongoose to populate the User field with the actual document from the User collection when querying the database.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    cameraid: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customerid: {
        type: String,
        required: true,
        trim: true
    },
    cameraname: {
        type: String,
        required: true,
        trim: true
    },
    cameraurl: {
        type: String,
        required: true,
        trim: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    deviceid: {
        type: String,
        required: true,
        trim: true
    },
    is360: {
        type: Boolean,
        required: true
    },
    isfhd: {
        type: Boolean,
        required: true,
    },
    islive: {
        type: Number,
        required: true
    },
    isnumplate: {
        type: Boolean
    },
    isptz: {
        type: Boolean
    },
    plandays: {
        type: Number
    },
    plandisplayname: {
        type: String,
        required: true
    },
    planname: {
        type: String
    },
    streamname: {
        type: [String],
        required: true
    },
    isP2P: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Cammera', cammeraSchema);