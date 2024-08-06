const user = require('../../models/user');
const camera = require('../../models/cammera');

module.exports = async (req, res) => {
    try {
        // User successfully fetched
        const isUserExist = await user.findById(req.User)
        if (!isUserExist) {
            return res.status(404).json({ error: "Unexpected error occured", message: "Login again" });
        }
        if (isUserExist.role === "User") {
            return res.status(403).json({ error: "Permission denied", message: "You are not allowed to add camera" });
        }

        // Check the customer id
        const addCameraToThisUser = await user.findById({ _id: req.params.customerid });
        if (!addCameraToThisUser) {
            return res.status(404).json({ error: "Customer not found" });
        }
        if (["Super admin", "Admin", "Manager"].includes(addCameraToThisUser.role)) {
            return res.status(403).json({ error: "Permission denied", message: "You are only able to add camera to the user" });
        }

        // Check the request body
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty", message: "Add camera detail for adding" })
        }

        // Destructure request body
        const {
            cameraid,
            customerid,
            cameraname,
            cameraurl,
            deviceid,
            is360,
            isfhd,
            islive,
            isnumplate,
            isptz,
            plandays,
            plandisplayname,
            planname,
            streamname
        } = req.body;

        // Checking cammera already exist or not
        const cameraExist = await camera.findOne({ cameraid: cameraid });
        if (cameraExist) {
            console.log("Camera already exist");
            return res.status(409).json({ error: "Camera with the same ID already exists." })
        }

        // Should be not enter userDetail manully
        if (req.body.user || req.body.createdDate) {
            console.log(`Entry for this field not allowed : user & created-date`);
            return res.status(400).json({ error: "User & CreatedDate field entry", message: "Not allowed entry for this field" });
        }

        // Adding the camera detail
        await camera.create({
            user: req.params.customerid,
            cameraid,
            customerid,
            cameraname,
            cameraurl,
            deviceid,
            is360,
            isfhd,
            islive,
            isnumplate,
            isptz,
            plandays,
            plandisplayname,
            planname,
            streamname
        })

        // Result
        console.log("New camera detail added");
        return res.status(201).json({ message: "Camera added successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occur while adding the new camera", error: "Internal server error", detail: error.message });
    }
};