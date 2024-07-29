const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require("helmet");
const cors = require("cors");
require('dotenv').config();
const connectToMongo = require('./config/db');
// const errorHandler = require('./middleware/errorHandling');
// const RedisStore = require('connect-redis')(session);
// const redis = require('redis');

// Run the database
(async () => {
    await connectToMongo();
})();       

// Creating an express application instance
const app = express();
// Port number
const port = process.env.PORT || 3000;

// const redisClient = redis.createClient();

// Parsing incoming request bodies as JSON
app.use(express.json())
// Secure your page by hiding some header details like website technology
app.use(helmet())
// Allow two ports to execute
app.use(cors())

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
        // maxAge: 1000 * 60 * 60 * 24 * 7 // Session age is 7 days
        maxAge: 1000 * 60 * (process.env.SESSION_AGE_MIN || 1) // 1 minute
    }
}));

// Routes
// app.use('/api/camerastatus', require('./routes/cameraStatus'))
app.use('/api/user', require('./routes/user'));
app.use('/emailservice/user', require('./routes/handleEmail'))
// app.use('/api/camera', require("./routes/cammera"))
app.get('/', (req, res) => {
    res.send("Home Page");
})

// Error handling, always use before listening the port
// app.use(errorHandler);

// Express server to listen on the specified port
app.listen(port, () => {
    console.log(`Listening port = http://localhost:${port}`);
})