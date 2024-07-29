// All error handle in this file (server error and api errors)
// This file made in the middleware file 

// Making the function for pass out the error
// All typt of data it can access (err)
function errorHandler(err, req, res, next) {
    const status = err.status || 500;

    // Storing the result in the object for not showing any extra key on the resonse
    const response = {};
    if (err.error) response.error = err.error;
    if (err.message) { 
        response.message = err.message; 
    } else { 
        response.message = "Backend error"; 
    }
    
    // Response of error ,, It will call via next() function
    return res.status(status).json(response);
}

module.exports = errorHandler;