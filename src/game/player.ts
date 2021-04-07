/**
* Class design for a player
*/

import ws from 'ws';

class Player {
    connection: ws.WebSocket;
    playerUsername: string;
    playerID: string;
    heroID: number;
    // Player stats
    HP: number;
    shield: number;
    speed: number;
}

export default Player; 