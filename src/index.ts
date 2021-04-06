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
import ws from 'ws';
import routes from './routes'
// Functions
import {validateJWT} from './functions/token'

// Express App
const app = express();
// Use routes
app.use('/', routes)
// Start HTTP server
const httpServer = http.createServer(app);
// Start websocket 
const wss = new ws.Server({ server: httpServer });

httpServer.listen(`${process.env.PORT}`, () => {
    console.log(
        `🚀 Server ready at http://localhost:${process.env.PORT} & ws://localhost:${process.env.PORT}`,
    );
});

var wssClients = {}  // Object of Websocket clients

wss.on('connection', async function connection(ws, request, client) {
    if('authorization' in request.headers){
        var userDetails = await validateJWT(request.headers.authorization)
        if(userDetails.auth && userDetails.user){
            wssClients[`${userDetails.user.id}`] = ws
        }else{
            ws.close()
        }
    }else{
        ws.close()
    }
    
    ws.on('message', function message(msg) {
        console.log(`Received message ${msg}from user ${userDetails}`);
        ws.send(JSON.stringify({
            success: true,
            messgae: msg
        }))
    });
});