// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const jwt = require("jsonwebtoken")

// const userSchema = new Schema({

//     // SignUp : First page
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     phone: {
//         type: Number,
//         required: true,
//         trim: true
//     },
//     role: {
//         type: String,
//         default: "User"
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     },

//     // Account active ?
//     isAccountActive: {
//         type: Boolean,
//         default: false,
//         required: true
//     },

//     // SignUP : Second page (For forget password)
//     securityQuestion: {
//         type: String,
//         trim: true,
//         default: "How are you"
//     },
//     securityAnswer: {
//         type: String,
//         trim: true,
//         default: "Fine"
//     },

//     // Check either data verified
//     isPhoneVerified: {
//         type: Boolean,
//         default: false
//     },
//     isEmailVerified: {
//         type: Boolean,
//         default: false
//     },

//     // Last login device information
//     lastLogin: {
//         type: Date
//     },
//     // lastLoginDevice: {
//     //     type: String,
//     //     default: "Linux"
//     // },
//     // lastLoginBrowser: {
//     //     type: String,
//     //     default: "Chrome"
//     // },

//     // If password is wrong entered 3 times, Lock.
//     loginAttempts: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     // Lock untill 24 Hour
//     lockUntil: {
//         type: Number
//     },

//     //Storing token of the loggedIN Device
//     tokens: [{
//         token : {
//         type: String,
//         required: true
//         }
//     }]
// })


// // Generating the authentication token
// userSchema.methods.getAuthToken = async () => {
//     try {
//         const data = { User: { id: this._id } };
//         const authToken = await jwt.sign(data, process.env.JWT_SECRET_KEY, {
//             expiresIn: '7d'
//         })
//         // Storing the token
//         this.tokens = this.tokens.concat({token: authToken})
//         await this.save();
//         console.log(authToken);
//         return authToken;
//     } catch (error) {
//         console.error(error);
//         // return res.status(400).json({error: "Sory some error occure while creating the json web token",message: error.message});
//     }
// }



// module.exports = mongoose.model('User', userSchema);





const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");


const userSchema = new Schema({

    // SignUp: First page
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["User", "Manager", "Admin", "Super admin"],
        default: "User"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },

    // Account creating date
    accountCreationDate: {
        type: Date,
        default: Date.now
    },

    // Check if data is verified
    isPhoneVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },

    // Account active?
    isAccountActive: {
        type: Boolean,
        default: false,
        required: true
    },
    // If password is wrong entered 3 times, lock
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    // Lock until 24 hours
    lockUntil: {
        type: Date
    },

    // Storing tokens of the logged-in devices
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    // SignUp: Second page (For forget password)
    securityQuestion: {
        type: String,
        trim: true,
        default: "Enter your project name"
    },
    securityAnswer: {
        type: String,
        trim: true,
        default: "Cris"
    },

    // Last login device information
    // lastLogin: {
    //     type: Date
    // },
    // lastLoginDevice: {
    //     type: String,
    //     default: "Linux"
    // },
    // lastLoginBrowser: {
    //     type: String,
    //     default: "Chrome"
    // },

}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Generating the authentication token
userSchema.methods.getAuthToken = async function () {
    try {
        // JWT with expiry time

        const data = { User: { id: this._id } };

        const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY, {
            expiresIn: ((process.env.JWT_EXPIRE_TIME_MIN || 1) * 60 * 100)
        });

        // Reset login attempts on successful login
        this.loginAttempts = 0;
        this.lockUntil = null;

        // Storing the token
        this.tokens = this.tokens.concat({ token: authToken });
        await this.save();

        return authToken;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while creating the JSON web token");
    }
};

// Handling failed login attempts
userSchema.methods.incrementLoginAttempt = async function () {
    try {
        if (this.lockUntil && this.lockUntil > Date.now()) {
            // If the account is currently locked , do nothing
            throw new Error("Account is locked. Try again later.");
        }
        this.loginAttempts += 1;
        if (this.loginAttempts >= 3) {
            this.isAccountActive = false;
            this.lockUntil = new Date(Date.now() + ((process.env.LOCK_UNTIL_MIN || 10) * 60 * 1000));  // Lock in minute
        }
        await this.save();
    } catch (error) {
        console.error(error);
        throw new Error("An error occured while incrementing login attempts");
    }
}

module.exports = mongoose.model('User', userSchema);