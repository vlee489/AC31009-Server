/*
Runs all the code for the API
*/
//Env setup
if (process.env.NODE_ENV !== 'production') {
    console.warn("RUNNING IN DEV MODE! Do not use in production!")
    require('dotenv').config();
}

// Server related imports
import http from 'http';
const express = require('express');

import routes from './routes'
// Config
const PORT = process.env.PORT;

// Express App
const app = express();
// Use routes
app.use('/', routes)


// Turn on that server!
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });