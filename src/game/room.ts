/**
 * Contains of the classes and logics for a Game room/Lobby
 */

import { playerStatus, Player } from './player'
import { moveInput, Move } from './moves'
import luxon from 'luxon'
import totp from 'totp-generator'
import ws from 'ws';
import { IdError, moveTypeError, playerNullError } from '../functions/errors'
import heroByID from 'src/functions/gameData/heros';
import itemByID from 'src/functions/gameData/items';

interface status {
    full: boolean,
    playerA: null | playerStatus,
    playerB: null | playerStatus,
    roomCode: string,
    publicLobby: boolean,
    active: boolean;
};

interface addData {
    player: number;
    success: boolean;
}

interface attack {
    id: number,
    name: string,
    description: string,
    HPDamage: number,
    recoil: number,
    speed: number
}

interface playerMove {
    player: number;
    move: moveInput
}

class GameRoom {
    roomCode: string;
    playerA: null | Player;
    playerB: null | Player;
    openTime: luxon.DateTime;
    publicLobby: boolean;  // If the lobby is a public lobby
    moves: [Move];
    active: boolean;
    winner: number | null;  // 0 = A, 1 = B, 2 = drawsa

    public constructor(publicLobby: boolean) {
        this.publicLobby = publicLobby;
        this.roomCode = String(totp(`${process.env.TOTPKEY}`));
        this.playerA = null;
        this.playerB = null;
        this.openTime = luxon.DateTime.now();
        this.winner = null;
    }

    /**
     * Start the game room
     * @returns boolean if the game was started
     */
    public start(): boolean {
        if (this.playerA === null && this.playerB === null) {
            return false
        } else {
            this.active = true;
        }
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
            active: this.active
        }
        if (this.playerA && this.playerB) {
            reply.full = true;
        }
        if (this.playerA != null) {
            reply.playerA = this.playerA.getStatus()
        }
        if (this.playerB != null) {
            reply.playerB = this.playerB.getStatus()
        }
        return reply
    }

    /**
     * Add a player to the room
     * @returns If the action was successful or not
     */
    public addPlayer(wsConnection: ws.WebSocket, username: string, playerID: string, heroID: number): boolean | addData {
        // if both player spots are used
        if ((this.playerA != null) && (this.playerB != null)) {
            return false
        }
        try {
            if (this.playerA === null) {
                this.playerA = new Player(wsConnection, username, playerID, heroID)
                return {
                    player: 0,
                    success: true
                }
            } else {
                this.playerB = new Player(wsConnection, username, playerID, heroID)
                return {
                    player: 1,
                    success: true
                }
            }
        } catch {
            return false
        }
    }

    /**
     * Get details of a attack
     * @param heroID HeroID of hero
     * @param attackID AttackID for the attack
     * @returns The details of the attack
     */
    private getAttack(heroID: number, attackID: number): attack | null {
        const hero = heroByID[`${heroID}`];  // Get hero data
        for (let a in hero.attacks) {  // For each attack hero has
            if (hero.attacks[a].id == attackID) {
                return hero.attacks[a];
            }
        }
        return null;
    }

    /**
     * Calculate the moves damange / affects player A's moves has
     * @param playerAMove player A's moves
     * @param playerBMove player B's moves
     */
    private playerAMoveCalc(playerAMove: moveInput, playerBMove: moveInput) {
        switch (playerAMove.moveType) {
            case 0:
                var attack = this.getAttack(this.playerA.heroID, playerAMove.id);
                // if attack is null throw an error for invalid id
                if (!attack) {
                    throw new IdError("Invalid attackId")
                }
                // Check the other play is doing a sheild
                if (playerBMove.moveType === 3) {
                    if (this.playerB.shield <= 0) {
                        throw new IdError("No shield for playerB")
                    } else {
                        // If other player is using shield subtract one from shield
                        this.playerB.shield = -1
                    }
                } else {  // other player isn't using sheild
                    this.playerB.HP -= attack.HPDamage;  // Subtrack damage delt from other player's health
                    this.playerA.HP -= attack.recoil; // take away recoil
                }
                break;
            case 1:
                var item = null;
                for (let i in itemByID) {
                    if (itemByID[i].id == playerAMove.id) {
                        item = itemByID[i];
                        break;
                    }
                }
                if (item === null) {
                    throw new IdError("Invalid itemID")
                } else {
                    // for each affect the item has
                    for (let a in item.affect) {
                        const currentAffect = item.affect[a]
                        // Depending on the value, assign the affect to the player
                        switch (currentAffect.status) {
                            case 0:  // HP
                                this.playerA.HP += currentAffect.edit;
                                break;
                            case 1:  // recoil
                                this.playerA.HP -= currentAffect.edit;
                                break;
                            case 2: // speed
                                this.playerA.speed += currentAffect.edit;
                                break;
                            case 3:  // shield
                                this.playerA.shield += currentAffect.edit;
                                break;
                            default:
                                throw new IdError("Invalid affect statusID")
                        }
                    }
                }
                break;
            case 2:  // We can ignore as sheild affects oposite player's flow
                break;
            case 3:  // We can ignore as turn being skipped
                break;
            default:
                throw new moveTypeError("Invalid moveType")
        }
    }

    /**
     * Calculate the moves damange / affects player B's moves has
     * @param playerBMove player B's moves
     * @param playerAMove player A's moves
     */
    private playerBMoveCalc(playerBMove: moveInput, playerAMove: moveInput) {
        switch (playerBMove.moveType) {
            case 0:
                var attack = this.getAttack(this.playerB.heroID, playerBMove.id);
                // if attack is null throw an error for invalid id
                if (!attack) {
                    throw new IdError("Invalid attackId")
                }
                // Check the other play is doing a sheild
                if (playerAMove.moveType === 3) {
                    if (this.playerA.shield <= 0) {
                        throw new IdError("No shield for playerB")
                    } else {
                        // If other player is using shield subtract one from shield
                        this.playerB.shield = -1
                    }
                } else {  // other player isn't using sheild
                    this.playerA.HP -= attack.HPDamage;  // Subtrack damage delt from other player's health
                    this.playerB.HP -= attack.recoil; // take away recoil
                }
                break;
            case 1:
                var item = null;
                for (let i in itemByID) {
                    if (itemByID[i].id == playerBMove.id) {
                        item = itemByID[i];
                        break;
                    }
                }
                if (item === null) {
                    throw new IdError("Invalid itemID")
                } else {
                    // for each affect the item has
                    for (let a in item.affect) {
                        const currentAffect = item.affect[a]
                        // Depending on the value, assign the affect to the player
                        switch (currentAffect.status) {
                            case 0:  // HP
                                this.playerB.HP += currentAffect.edit;
                                break;
                            case 1:  // recoil
                                this.playerB.HP -= currentAffect.edit;
                                break;
                            case 2: // speed
                                this.playerB.speed += currentAffect.edit;
                                break;
                            case 3:  // shield
                                this.playerB.shield += currentAffect.edit;
                                break;
                            default:
                                throw new IdError("Invalid affect statusID")
                        }
                    }
                }
                break;
            case 2:  // We can ignore as sheild affects oposite player's flow
                break;
            case 3:  // We can ignore as turn being skipped
                break;
            default:
                throw new moveTypeError("Invalid moveType")
        }
    }

    /**
     * Calculates the game state
     */
    private calculateGameState() {
        if ((this.playerA.HP <= 0) && (this.playerB.HP <= 0)) {
            this.playerA.HP = 0;  // Make sure the lowest HP can be is 0
            this.playerB.HP = 0;  // Make sure the lowest HP can be is 0
            this.active = false;
            this.winner = 2;

        } else if (this.playerA.HP <= 0) {
            this.playerA.HP = 0;  // Make sure the lowest HP can be is 0
            this.active = false;
            this.winner = 1;
        } else if (this.playerB.HP <= 0) {
            this.playerB.HP = 0;  // Make sure the lowest HP can be is 0
            this.active = false;
            this.winner = 0;
        }
    }

    /**
     * Send's the move data back to the two clients
     */
    private sendMoveResponse(moves: Array<playerMove>) {
        const jsonString = JSON.stringify({
            reply: "round",
            round: this.moves.length,
            moves: moves,
            playerA: this.playerA.getStatus(),
            playerB: this.playerB.getStatus(),
            active: this.active,
            winner: this.winner

        })
        this.playerA.connection.send(jsonString)
        this.playerB.connection.send(jsonString)
    }

    public calculateMoveSend(playerAMove: moveInput, playerBMove: moveInput): status {
        if ((this.playerA === null) || (this.playerB === null)) {
            throw new playerNullError("Full not full");
        }
        if ((playerAMove.moveType < 0 || playerAMove.moveType > 3) || (playerBMove.moveType < 0 || playerBMove.moveType > 3)) {
            throw new moveTypeError("Invalid moveType");
        }
        var moveArray: Array<playerMove> = [];  // Hold the array of moves ran
        // Check and apply any items a player might have used
        if (playerAMove.moveType === 1) {
            this.playerAMoveCalc(playerAMove, playerBMove);
            moveArray.push({ player: 0, move: playerAMove })
        }
        if (playerBMove.moveType === 1) {
            this.playerBMoveCalc(playerBMove, playerAMove);
            moveArray.push({ player: 0, move: playerBMove })
        }
        // We ignore Shield and skip as they're delt by the calc flow for each player
        // Create and append move.
        this.moves.push(new Move(playerAMove, playerBMove));
        if ((playerAMove.moveType === 0) && (playerBMove.moveType === 0)) {
            // If both players are making an attack
            const Aattack = this.getAttack(this.playerA.heroID, playerAMove.id);
            const Battack = this.getAttack(this.playerB.heroID, playerBMove.id);
            if (Aattack.speed > Battack.speed) {  // If the attack speed of A > B
                this.playerAMoveCalc(playerAMove, playerBMove);  // Run player A's move calc
                moveArray.push({ player: 0, move: playerAMove })
                this.calculateGameState();  // Calculate Stats
                if ((this.playerB.HP == 0) || (this.playerA.HP == 0)) {
                    // Check if either player is dead, if so end moves here
                    this.sendMoveResponse(moveArray)
                } else {  // If both players are alive 
                    this.playerBMoveCalc(playerBMove, playerAMove);  // Run player B's move calc
                    moveArray.push({ player: 2, move: playerBMove })  // Add move to array
                    this.calculateGameState();  // Calculate Stats
                    this.sendMoveResponse(moveArray)  // send to clients
                }
            } else {  // If the attack speed of B > A
                this.playerBMoveCalc(playerBMove, playerAMove);  // Run player A's move calc
                moveArray.push({ player: 0, move: playerBMove })
                this.calculateGameState();  // Calculate Stats
                if ((this.playerB.HP == 0) || (this.playerA.HP == 0)) {
                    // Check if either player is dead, if so end moves here
                    this.sendMoveResponse(moveArray)
                } else {  // If both players are alive 
                    this.playerAMoveCalc(playerAMove, playerBMove);  // Run player B's move calc
                    moveArray.push({ player: 2, move: playerAMove })  // Add move to array
                    this.calculateGameState();  // Calculate Stats
                    this.sendMoveResponse(moveArray)  // send to clients
                }
            }
            return this.status()
        }
        if (playerAMove.moveType === 0) {
            this.playerAMoveCalc(playerAMove, playerBMove);  // Run player A's move calc
            moveArray.push({ player: 0, move: playerAMove })
            this.calculateGameState();  // Calculate Stats
            this.sendMoveResponse(moveArray)  // send to clients
        } else if (playerBMove.moveType === 0) {
            this.playerBMoveCalc(playerBMove, playerAMove);  // Run player A's move calc
            moveArray.push({ player: 0, move: playerBMove })
            this.calculateGameState();  // Calculate Stats
            this.sendMoveResponse(moveArray)  // send to clients
        }
        return this.status()
    }
}