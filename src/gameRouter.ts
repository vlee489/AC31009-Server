/**
 * Incharge of all the routing and storing of games.
 */

import { GameRoom } from './game/room'
import { moveInput } from './game/moves'
import ws from 'ws';
import gameData from './routes/gameData';

interface gameData {
    game: GameRoom,
    playerA: string | null,  // Id of player
    playerB: string | null,  // Id of player
    playerAMove: moveInput | null,
    playerBMove: moveInput | null,
}

var masterLobbies = {}; // An object of all rooms with the key as the roomID
var openLobbies = {};   // Stores any lobbies publically open

/**
 * Open a new lobby
 * @param open to be publically shown or not
 * @returns Room Code to join
 */
export function openLobby(open: boolean): string {
    const newRoom = new GameRoom(open);
    masterLobbies[`${newRoom.roomCode}`] = {
        game: newRoom,
        playerA: null,
        playerB: null,
        playerAMove: null,
        playerBMove: null,
    };
    if (open) {
        openLobbies[`${newRoom.roomCode}`] = newRoom;
    }
    return `${newRoom.roomCode}`;
}

export function joinLobby(lobbyID: string, wsConnection: ws.WebSocket,
    username: string, playerID: string, heroID: number): boolean {
    const room = masterLobbies[`${lobbyID}`] as gameData;  // Get room
    // If lobby doesn't exist we return false
    if (!room) {
        wsConnection.send(JSON.stringify({
            success: false,
            action: "join",
            message: "Room does not exist"
        }))
        return false;
    }
    const addReply = room.game.addPlayer(wsConnection, username, playerID, heroID);
    if (addReply.success === false) {  // If get false back then the room is full;
        wsConnection.send(JSON.stringify({
            success: false,
            action: "join",
            message: "Room full"
        }))
        return false;
    } else {
        if (addReply.player === 0) {
            room.playerA = playerID;
            masterLobbies[`${lobbyID}`] = room;
            // send room status
            wsConnection.send(JSON.stringify({
                success: true,
                action: "join",
                playerA: room.game.getPlayerAStatus(),
                playerB: room.game.getPlayerBStatus(),
            }))
        } else if (addReply.player === 1) {
            room.playerB = playerID;
            masterLobbies[`${lobbyID}`] = room;
            wsConnection.send(JSON.stringify({
                success: true,
                action: "join",
                playerA: room.game.getPlayerAStatus(),
                playerB: room.game.getPlayerBStatus(),
            }))
        } else {
            wsConnection.send(JSON.stringify({
                success: false,
                action: "join",
                message: "Internal Server Error"
            }))
            return false;
        }
        // After joining lobby, check if it's full. If full then we start the lobby
        if ((room.playerA != null) && (room.playerB != null)) {
            room.game.start();
        }
        return true;
    }
}

export function setNextMove(lobbyID: string, wsConnection: ws.WebSocket,
    playerID: string, moveInput): boolean {
    const room = masterLobbies[`${lobbyID}`] as gameData;  // Get room
    // If lobby doesn't exist we return false
    if (!room) {
        wsConnection.send(JSON.stringify({
            success: false,
            message: "Room does not exist"
        }))
        return false;
    }
    if (room.playerA === playerID) {
        room.playerAMove = moveInput;
        masterLobbies[`${lobbyID}`] = room;
        wsConnection.send(JSON.stringify({
            success: true,
            action: "move",
        }))
    } else if (room.playerB === playerID) {
        room.playerBMove = moveInput;
        masterLobbies[`${lobbyID}`] = room;
        wsConnection.send(JSON.stringify({
            success: true,
            action: "move",
        }))
    } else {
        wsConnection.send(JSON.stringify({
            success: false,
            action: "move",
            message: "player not in room"
        }))
        return false;
    }
    // Check if both moves are filled out, if they are we then run the move
    if ((room.playerAMove != null) && (room.playerBMove != null)) {
        room.game.calculateMoveSend(room.playerAMove, room.playerBMove)
        room.playerAMove = null;
        room.playerBMove = null;
        masterLobbies[`${lobbyID}`] = room;
    }
    return true;
}