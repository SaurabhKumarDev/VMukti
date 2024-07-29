const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    _id: {
        type: String, // or ObjectId if you prefer
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    session: {
        type: String, // Storing the session data as a string
        required: true
    }
});

// Create a model from the schema
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
