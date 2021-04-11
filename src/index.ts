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
import { validateJWT } from './functions/token'
import { joinLobby, setNextMove } from './gameRouter'

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
    if ('authorization' in request.headers) {
        var userDetails = await validateJWT(request.headers.authorization)
        if (userDetails.auth && userDetails.user) {
            wssClients[`${userDetails.user.id}`] = ws
        } else {
            ws.close()
        }
    } else {
        ws.close()
    }

    ws.on('message', function message(msg) {
        try {
            var body = JSON.parse(msg);
        } catch {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid BODY format"
            }))
        }
        switch (body.action) {
            case "join":
                if (!("roomCode" in body)) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "roomCode not provided"
                    }))
                    return
                }
                if (!("hero" in body)) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "hero not provided"
                    }))
                    return
                }
                if (!("id" in body.hero)) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "hero ID not provided"
                    }))
                    return
                }
                joinLobby(body.roomCode, ws, userDetails.user.username, userDetails.user.id, body.hero.id)
                break;
            case "move":
                if (!("roomCode" in body)) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "roomCode not provided"
                    }))
                    return
                }
                if (!("move" in body)) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "move not provided"
                    }))
                    return
                }
                if ((!("moveType" in body.move)) || (!("id" in body.move))) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "move type or ID not provided"
                    }))
                    return
                }
                setNextMove(body.roomCode, ws, userDetails.user.id, body.move);
                break;
            case "PING":
                ws.send(JSON.stringify({
                    success: true,
                    message: "PONG"
                }))
                break;
            default:
                ws.send(JSON.stringify({
                    success: false,
                    message: "unsupported action/no action provided"
                }))
                break;
        }
        return;
    });
});