// Import mongoose for database
const mongoose = require("mongoose");
// Load environment value
require('dotenv').config();

// async - await for connecting the database
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

// Exporting function
module.exports = connectToMongo;