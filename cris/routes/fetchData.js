const express = require('express');
const router = express.Router();

// Import Axios for making HTTP requests
const axios = require('axios');
// Import https to create a custom agent
const https = require("https");

// Create an https agent with rejectUnauthorized set to false
// this will allow us to bypass SSL Certificate verification
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

router.get('/', async (req, res) => {
    try {
        // Fetch data from the specified URL using Axios with the custom https agent
        const response = await axios.get(process.env.FETCH_URL_FOR_DATA, { httpsAgent });
        // Fetched data
        const responseData = response.data;

        // Output of the data
        res.status(200).json(responseData);
    } catch (error) {
        // Handle errors that occur during the Axios request
        console.error("Sorry, some server error occurred:", error);
        res.status(500).json({ message: "Sorry, some server error occurred", error }); // Send an error response
    }
});

module.exports = router;