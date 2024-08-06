const user = require("../../models/user");
const camera = require("../../models/cammera");
const axios = require('axios');
const https = require("https");     // Create custom agent

// Create an https agent with rejectUnauthorized set to false
// this will allow us to bypass SSL Certificate verification
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const adminAccessedCameraDetail = async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            console.error("Unexpected error occure, login again");
            return res.status(404).json({ error: "Unexpected error occured", message: "Login again" });
        }

        // Check the user role
        if (isUserExist.role === "Super admin") {

            // Camera details
            const cameras = await camera.find({});

            // Check camera exist
            if (Object.keys(cameras).length === 0) {
                return res.status(204).json({ message: "No camera available" });
            }

            // Result
            console.log(`Camera details fetched by ${isUserExist.name}`);
            return res.status(200).json({ message: "All camera fetched", user: isUserExist.name, camera: { total_camera: Object.keys(cameras).length, camera_detail: cameras } });
        } else {
            console.log("Permission denied");
            return res.status(403).json({ error: "Forbidden", message: "You do not have suffiecient permission to access all the cameras" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

const adminFetchedCameraByUserId = async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            return res.status(404).json({ error: "Unexpected error occured", message: "Login again" });
        }

        // Check the user role
        if (["Super admin", "Admin", "Manager"].includes(isUserExist.role)) {

            // Fetch camera
            const isCamera = await camera.find({ user: req.params.userID });

            // Check camera exist
            if (Object.keys(isCamera).length === 0) {
                return res.status(204).json({ message: "Camera doesn't exist" });
            }
            return res.status(200).json({ message: "Camera fetched successfully", camera: isCamera });
        } else {
            console.log("Permission denied");
            return res.status(403).json({ error: "Forbidden", message: "You do not have suffiecient permission to access the cameras" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const userCameraDetail = async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            return res.status(404).json({ error: "Unexpected error occured", message: "Login again" });
        }

        // Fetch camera
        const cameraExist = await camera.find({ user: isUserExist.id });

        // Check camera exist
        if (Object.keys(cameraExist).length === 0) {
            return res.status(204).json({ message: "Camera doesn't exist" });
        }
        return res.status(200).json({ message: "Camera fetched successfully", camera: cameraExist });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

const fetchCameraViaURL = async (req, res) => {
    try {
        // Check if the URL is defined in the environment variables
        if (!process.env.FETCH_URL_FOR_DATA) {
            throw new Error("URL is not defined");
        }

        // Fetch data from the specified URL using Axios with the custom https agent
        const response = await axios.get(process.env.FETCH_URL_FOR_DATA, { httpsAgent });
        // Fetched data
        const responseData = response.data;

        // Output of the data
        return res.status(200).json(responseData);
    } catch (error) {
        // Handle errors that occur during the Axios request
        console.error("Sorry, some server error occurred:", error);
        res.status(500).json({ message: "Sorry, some server error occurred", error }); // Send an error response
    }
}

module.exports = { adminAccessedCameraDetail, userCameraDetail, adminFetchedCameraByUserId, fetchCameraViaURL };