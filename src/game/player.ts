/**
* Class design for a player
*/

import ws from 'ws';
import heroByID from '../functions/gameData/heros'
import { IdError } from '../functions/errors'

export interface playerStatus {
    playerUsername: string;
    playerID: string;
    heroID: number;
    HP: number;
    shield: number;
    speed: number;
    speedLength: number;
}

export class Player {
    connection: ws.WebSocket;
    playerUsername: string;
    playerID: string;
    heroID: number;
    // Player stats
    HP: number;
    shield: number;
    speed: number;  // The speed diff to the game
    speedLength: number;

    public constructor(wsConnection: ws.WebSocket, username: string, playerID: string, heroID: number) {
        this.connection = wsConnection;
        this.playerUsername = username;
        this.playerID = playerID;

        // Check HeroID
        if (!(heroID in heroByID)) {
            throw new IdError("invalid Hero ID")
        } else {
            this.heroID = heroID;
            this.HP = heroByID[`${heroID}`].health;
            this.shield = heroByID[`${heroID}`].shields;
            this.speed = 0;
            this.speedLength = 0;
        }
    }

    public addStats(hp: number, shield: number): void {
        this.HP += hp;
        this.shield += shield;
    }

    public subStats(hp: number, shield: number): void {
        this.HP -= hp;
        this.shield -= shield;
    }

    public editSpeed(speed: number, speedLength: number): void {
        this.speed = speed;
        this.speedLength = speedLength;
    }

    public getStatus(): playerStatus {
        return {
            playerUsername: this.playerUsername,
            playerID: this.playerID,
            heroID: this.heroID,
            HP: this.HP,
            shield: this.shield,
            speed: this.speed,
            speedLength: this.speedLength
        }
    }
}

export default Player;