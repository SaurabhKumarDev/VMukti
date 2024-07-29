const mongoose = require("mongoose");
require('dotenv').config();

const connectToMongo = async () => {
    const dbName = process.env.MONGO_DB_NAME;

    if (!dbName) {
        return console.error("Database name is not defined. Check the .env file.");
    }

    try {
        await mongoose.connect(dbName, {});
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('Could not connect to the database. Server error:', error);
    }
};

module.exports = connectToMongo;
