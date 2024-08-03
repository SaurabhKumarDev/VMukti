const user = require("../../models/user");
const camera = require("../../models/cammera");

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
                return res.status(204).send("No camera available");
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
        if (isUserExist.role === "Super admin" || isUserExist.role === "Admin" || isUserExist.role === "Manager") {

            // Fetch camera
            const isCamera = await camera.find({ user: req.params.userID });

            // Check camera exist
            if (Object.keys(isCamera).length === 0) {
                return res.status(204).send("Camera doesn't exist");
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
            return res.status(204).send("Camera doesn't exist");
        }
        return res.status(200).json({ message: "Camera fetched successfully", camera: cameraExist });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

module.exports = { adminAccessedCameraDetail, userCameraDetail, adminFetchedCameraByUserId };