const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require("helmet");
const cors = require("cors");
require('dotenv').config();
const connectToMongo = require('./config/db');

// Run the database
(async () => {
    await connectToMongo();
})();       

// Creating an express application instance
const app = express();
// Port number
const port = process.env.PORT || 3000;

// Body parser
app.use(bodyParser.json())
// Cookie parsar
app.use(cookieParser());
// Parsing incoming request bodies as JSON
app.use(express.json())
// Secure your page by hiding some header details like website technology
app.use(helmet())
// Allow two ports to execute
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3000"],
    credentials: true
}))

// Session configuration
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_NAME,
        collectionName: "session"
    }),
    cookie: {
        maxAge: 1000 * 60 * (process.env.SESSION_AGE_MIN || 1),
        secure: false
    }
}));

// Route
app.use('/api/user', require('./routes/user'));
app.use('/emailservice/user', require('./routes/handleEmail'))
// app.use('/api/camerastatus', require('./routes/cameraStatus'))
app.use('/api/camera', require("./routes/cammera"))

app.get('/', (req, res) => {
    res.send("Home Page");
})

// Express server to listen on the specified port
app.listen(port, () => {
    console.log(`Listening port = http://localhost:${port}`);
})