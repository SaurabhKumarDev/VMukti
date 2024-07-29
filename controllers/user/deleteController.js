module.exports = async (req, res) => {
    try {
        const userId = req.User;
        const targetUserId = req.params.id;

        // Checking the user attempting to delete
        const userTryToDelete = await user.findById(userId);

        // If role is not present 
        if (!userTryToDelete.role) {
            console.log("No role found for the user attempting to delete.");
            return res.status(404).json({ message: "User role not found, So you're not allow to remove anyone" })
        }

        // Fetching the user to be deleted
        const deleteThisUser = await user.findById(targetUserId);
        if (!deleteThisUser) {
            console.log("User to delete not found");
            return res.status(404).json({ message: "User to delete not found" })
        } else if (!deleteThisUser.role) {
            console.log("Role is not defined to delete a user");
            return res.status(404).json({ message: "User to delete not found role" })
        }

        // As per User role deleting the user
        switch (userTryToDelete.role) {
            case "Super admin": {
                // Find out the role of removing USER
                const roleOfDeletingUser = deleteThisUser.role;
                if (roleOfDeletingUser === "Admin" || roleOfDeletingUser === "Manager" || roleOfDeletingUser === "User") {

                    // Removing the user from the database
                    await user.findByIdAndDelete(targetUserId);

                    // Result
                    console.log("User removed successfully");
                    return res.status(200).json({ message: "User removed successfully", deletedUser: deleteThisUser.email })

                } else if (roleOfDeletingUser === "Super admin") {
                    console.log("You are not authorize to delete this User");
                    return res.status(400).json({ message: "You are not allowed to remove this User from the database" });
                } else {
                    console.log("Some error occure in the role of the user , Which one do you want to delete");
                    return res.status(400).json({ error: "Target user role error", message: "Contact developer teams" })
                }
            }

            case "Admin": {
                // Find out the role of removing USER
                const roleOfDeletingUser = deleteThisUser.role;
                if (roleOfDeletingUser === "Manager" || roleOfDeletingUser === " User" || userId === targetUserId) {

                    // Removing the user from the database
                    await user.findByIdAndDelete(targetUserId);

                    // Result
                    console.log("User removed successfully");
                    return res.status(200).json({ message: "User removed successfully", deletedUser: deleteThisUser.email })

                } else if (roleOfDeletingUser === "Super admin" || roleOfDeletingUser === "Admin") {
                    console.log("You are not authorize to delete this User");
                    return res.status(400).json({ message: "You are not allowed to remove this User from the database" });
                } else {
                    console.log("Some error occure in the role of the user , Which one do you want to delete");
                    return res.status(400).json({ error: "Target user role error", message: "Contact developer teams" })
                }
            }

            case "Manager": {
                // Find out the role of removing USER
                const roleOfDeletingUser = deleteThisUser.role;
                if (roleOfDeletingUser === " User" || userId === targetUserId) {

                    // Removing the user from the database
                    await user.findByIdAndDelete(targetUserId);

                    // Result
                    console.log("User removed successfully");
                    return res.status(200).json({ message: "User removed successfully", deletedUser: deleteThisUser.email })

                } else if (roleOfDeletingUser === "Manager" || roleOfDeletingUser === "Super admin" || roleOfDeletingUser === "Admin") {
                    console.log("You are not authorize to delete this User");
                    return res.status(400).json({ message: "You are not allowed to remove this User from the database" });
                } else {
                    console.log("Some error occure in the role of the user , Which one do you want to delete");
                    return res.status(400).json({ error: "Target user role error", message: "Contact developer teams" })
                }
            }

            case "User": {
                if (userId === targetUserId) {
                    // Removing the user from the database
                    await user.findByIdAndDelete(targetUserId);

                    // Result
                    console.log("User removed successfully");
                    return res.status(200).json({ message: "User removed successfully", deletedUser: deleteThisUser.email })
                } else {
                    console.log("You are not authorize to delete this User");
                    return res.status(400).json({ message: "You are not allowed to remove this User from the database" });
                }
            }

            default: {
                console.log("Unexpected error occure");
                return res.status(400).json({ error: "User role error", message: "Contact to developer team" });
            }
        }
    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({ message: "Some error occure while removing the user from the database", error: error });
    }
}