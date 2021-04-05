/**
 * Game Mongoose Model
 */
import { DB } from "../db"
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
            moveID: Number, // Move player made this round
            // Stats of the player after opponent's move
            stats: [{
                statID: Number,
                value: Number
            }]
        },
        playerB: {
            moveID: Number, // Move player made this round
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