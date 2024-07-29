const express = require("express");
const session = require('express-session');
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const connectToMongo = require('./db');
const errorHandler = require('./middleware/errorHandling');

// Execute the db.js for connecting the db, 
// Added `async-await` to ensure database connection is established before starting the server
(async () => {
    await connectToMongo();
})();

// Creating an express application instance
const app = express();

// Port number to run the website on that port
const port = process.env.PORT || 3000;


// Middleware

// Enable Cors and filtering some keys
// app.use(cors({
//     methods: "GET, PUT, PATCH, DELETE, POST",
//     origin: "http://localhost:5000",        // [Only this origin will access the response]
//     allowedHeaders: "Auth-Token",
//     optionsSuccessStatus: 200
// }));

// Parsing incoming request bodies as JSON
app.use(express.json()) 

// Secure your page by hiding some header details like website technology
app.use(helmet())       

app.use(cors())
// Set up secret key of cookies parsar
// app.use(cookieParser(process.env.JWT_SECRET_KEY))       
// Define the session
// app.use(session(({
//     secret: process.env.JWT_SECRET_KEY,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: 10000,
//     },
// })));   

// Routes
app.use('/api/user', require('./routes/user'))    
app.use('/api/cameras', require('./routes/cammera'))    
app.use('/api/external_api', require("./routes/fetchData"))    

// Error handling middleware, always use before listening the port
app.use(errorHandler);

// Express server to listen on the specified port
app.listen(port, () => {
    console.log(`Listening port = http://localhost:${port}`);
})

// Route for the root
app.get('/', (req, res) => {
    console.log(`Session : ${req.session}, SessionID : ${req.session.id}`);
    req.session.visited = true;
   // res.cookie("hello", "world", { maxAge: 30000, signed: true });
    res.json("Testing : Express, index.js")
})