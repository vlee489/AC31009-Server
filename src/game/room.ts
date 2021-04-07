/**
 * Contains of the classes and logics for a Game room/Lobby
 */

import Player from './player'
import Move from './moves'
import luxon from 'luxon'
import totp from 'totp-generator'

interface playerDetails {
    HP: number,
    shield: number,
    speed: number
};

interface status {
    full: boolean,
    playerA: null | playerDetails,
    playerB: null | playerDetails,
    roomCode: string,
    publicLobby: boolean
};

class GameRoom {
    roomCode: string;
    playerA: null | Player;
    playerB: null | Player;
    openTime: luxon.DateTime;
    publicLobby: boolean;  // If the lobby is a public lobby
    moves: [Move]

    public constructor(publicLobby: boolean) {
        this.publicLobby = publicLobby;
        this.roomCode = String(totp(`${process.env.TOTPKEY}`));
        this.playerA = null;
        this.playerB = null;
        this.openTime = luxon.DateTime.now()
    }

    /**
     * Get the status of the room
     * @returns Status of the room
     */
    public status(): status {
        var reply = {
            roomCode: this.roomCode,
            publicLobby: this.publicLobby,
            full: false,
            playerA: null,
            playerB: null,
        }
        if (this.playerA && this.playerB) {
            reply.full = true;
        }
        if (this.playerA != null) {
            reply.playerA = {
                HP: this.playerA.HP,
                shield: this.playerA.shield,
                speed: this.playerA.speed,
            }
        }
        if (this.playerB != null) {
            reply.playerB = {
                HP: this.playerB.HP,
                shield: this.playerB.shield,
                speed: this.playerB.speed,
            }
        }
        return reply
    }

    /**
     * Add a player to the room
     * @returns If the action was successful or not
     */
    public addPlayer(): boolean{
        // if both player spots are used
        if((this.playerA != null) && (this.playerB != null)){
            return false
        }
        if(this.playerA === null){
            this.playerA = new Player()
            return true
        }else{
            this.playerB = new Player()
            return true
        }
    }
}