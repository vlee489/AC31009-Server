/**
 * Game Mongoose Model
 */
import { DB } from "../DB"
import mongoose from "mongoose";

const { Schema } = mongoose;
import { GameDocument, GameModel, GameSchema } from "../interfaces/mongoose.gen";

const GameSchema: GameSchema = new Schema({
    joinCode: {
        type: String,
        required: true,
    },
    playerA: {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        character: {
            heroID: Number,
            statEdits: [{
                statID: Number,
                edit: Number,
            }]
        } 
    },
    playerB: {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        character: {
            heroID: Number,
            statEdits: [{
                statID: Number,
                edit: Number,
            }]
        } 
    },
    moves: [{
        moveNumber: {
            type: Number,
            min: 0
        },
        // Stats for each player are calculated for after the move has been carried out
        playerA: {
            // Move player made this round
            move: {
                moveType: {
                    // 0: attack, 1: item, 2:shield, 3: skip
                    type: Number,
                    min: 0,
                    max: 3,
                    validate : {
                        validator : Number.isInteger,
                        message   : '{VALUE} is not an integer value'
                      }
                },
                id: Number
            },
            // Stats of the player after opponent's move
            stats: [{
                statID: Number,
                value: Number
            }]
        },
        playerB: {
            // Move player made this round
            move: {
                moveType: {
                    // 0: attack, 1: item, 2: skip
                    type: Number,
                    min: 0,
                    max: 2,
                    validate : {
                        validator : Number.isInteger,
                        message   : '{VALUE} is not an integer value'
                      }
                },
                id: Number
            },
            // Stats of the player after opponent's move
            stats: [{
                statID: Number,
                value: Number
            }]
        }
    }]
});

export const Game: GameModel = DB.model<GameDocument, GameModel>("Game", GameSchema);
export default Game;