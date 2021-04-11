/**
 * Class for moves
 */

export interface moveInput {
    moveType: number,
    id: number | null,
}

export class Move{
     playerA: {
         moveType: number,
         move: number | null
     };
     playerB: {
        moveType: number,
        move: number | null
    }

    public constructor(playerA: moveInput, playerB: moveInput){
        this.playerA = {
            moveType: playerA.moveType,
            move: playerA.id
        }
        this.playerB = {
            moveType: playerB.moveType,
            move: playerB.id
        }
    }
}

export default Move;