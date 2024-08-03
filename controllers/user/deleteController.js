const user = require('../../models/user')

const deleteUser = async (res, targetUserId, deleteThisUser) => {
    await user.findByIdAndDelete(targetUserId);
    console.log("User removed successfully");
    return res.status(200).json({ message: "User removed successfully", deletedUser: deleteThisUser.email });
};

const adminRemoveUser = async (req, res) => {
    try {
        const userId = req.User;
        const targetUserId = req.params.id;

        // Fetching the user attempting to delete
        const userTryToDelete = await user.findById(userId);
        if (!userTryToDelete || !userTryToDelete.role) {
            console.log("No role found for the user attempting to delete.");
            return res.status(404).json({ message: "User role not found, So you're not allow to remove anyone" })
        }

        // Fetching the user to be deleted
        const deleteThisUser = await user.findById(targetUserId);
        if (!deleteThisUser || !deleteThisUser.role) {
            console.log("User to delete not found or has no defined role.");
            return res.status(404).json({ message: "User to delete not found or has no defined role." })
        }

        const roleOfDeletingUser = deleteThisUser.role;
        const userRole = userTryToDelete.role;

        if (userRole === "Super admin") {
            if (roleOfDeletingUser !== "Super admin") {
                return deleteUser(res, targetUserId, deleteThisUser);
            } else {
                console.log("You are not authorized to delete this User");
                return res.status(403).json({ message: "You are not allowed to remove this User from the database" });
            }
        } else if (userRole === "Admin") {
            if (["Manager", "User"].includes(roleOfDeletingUser) || userId === targetUserId) {
                return deleteUser(res, targetUserId, deleteThisUser);
            } else {
                console.log("You are not authorized to delete this User");
                return res.status(403).json({ message: "You are not allowed to remove this User from the database" });
            }
        } else if (userRole === "Manager") {
            if (roleOfDeletingUser === "User" || userId === targetUserId) {
                return deleteUser(res, targetUserId, deleteThisUser);
            } else {
                console.log("You are not authorized to delete this User");
                return res.status(403).json({ message: "You are not allowed to remove this User from the database" });
            }
        } else if (userRole === "User") {
            if (userId === targetUserId) {
                return deleteUser(res, targetUserId, deleteThisUser);
            } else {
                console.log("You are not authorized to delete this User");
                return res.status(403).json({ message: "You are not allowed to remove this User from the database" });
            }
        } else {
            console.log("Unexpected error occurred");
            return res.status(400).json({ error: "User role error", message: "Contact the developer team" });
        }
    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({ message: "Some error occure while removing the user from the database", error: error });
    }
}

const selfAccountDeletion = async (req, res) => {
    try {
        // User Id of the user who is trying to delete their account
        const userId = req.User;
        const removeThisUser = await user.findById(userId);
        if (!removeThisUser) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        
        // Deleting the user
        await user.findByIdAndDelete(userId);
        
        // Response
        console.log("User removed successfully");
        return res.status(200).json({ message: "User removed successfully", deletedUser: removeThisUser.email });
    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({ message: "Some error occure while removing the user from the database", error: error });
    }
}

module.exports = { adminRemoveUser, selfAccountDeletion }