import express from 'express';
import {validateJWT} from '../functions/token'
import {openLobby} from '../gameRouter'


export const openLobbyPost = async (req: express.Request, res: express.Response) => {
    const jwt = req.get('Authorization')
    var userCred;
    if(!jwt){
        res.status(401).send({
            success: false,
        })
        return
    }else{
        userCred = await validateJWT(jwt)
    }
    if(!userCred.auth){
        res.status(401).send({
            success: false,
        })
        return
    }else{
        if('open' in req.body){
            const lobby = openLobby(req.body.open);
            res.send({
                success: false,
                roomCode: lobby
            })
            return
        }else{
            res.status(400).send({
                success: false,
                message: "missing field: open"
            })
            return 
        }
    }
};

export default openLobbyPost;