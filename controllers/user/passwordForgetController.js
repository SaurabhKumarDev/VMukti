module.exports = async (req, res) => {
        try {
            const { email, securityQuestion, securityAnswer } = req.body;

            // Filter out wrong entries
            const validFields = ["email", "securityQuestion", "securityAnswer"];
            for (const field in req.body) {
                if (!validFields.includes(field)) {
                    console.log("Invalid entry");
                    return res.status(400).json({ message: `Invalid field in the request body : '${field}'` });
                }
            }

            // Check user existance
            const userExist = await user.findOne({ email });
            if (!userExist) {
                console.error("Sorry, user does not exist with this email address");
                return res.status(400).json({ error: "User is not exist", message: "With this email address" });
            }

            // Forget process done by verified person
            if (!userExist.isEmailVerified) {
                const errorMessage = "Sorry, you are not able to reset your password because your account is not verified yet.";
                console.log(errorMessage);
                return res.status(403).json({ message: errorMessage });
            }

            // Check the security question
            if (userExist.securityQuestion !== securityQuestion) {
                console.error("This is not a valid security question");
                return res.status(400).json({ error: "Enter valid securty question", message: "This is not your security question" })
            }

            // Check the Securyt-answer
            const isCorrectSecurityAnswer = await bcrypt.compare(securityAnswer, userExist.securityAnswer);
            if (!isCorrectSecurityAnswer) {
                console.error("Wrong Security answer");
                return res.status(400).json({ error: "Wrong security answer" })
            }

            // Sending the email for forget the password
            try {
                sendForgetEmail(userExist, res);
            } catch (error) {
                console.error("Some error occured while sending the 'Reset password email' : ", error.message);
                return res.status(500).json({ message: "Error occured while sending the email", error: "Reset the password" })
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal Server Error", message: error.message });
        }
    }
