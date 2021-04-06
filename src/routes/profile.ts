import express from 'express';
import {validateJWT} from '../functions/token'
import User from '../models/user'

export const profile = async (req: express.Request, res: express.Response) => {
    const jwt = req.get('Authorization')
    var user;
    if(!jwt){
        res.status(401).send({
            success: false,
        })
    }else{
        user = await validateJWT(jwt)
    }
    if(!user.auth){
        res.status(401).send({
            success: false,
        })
    }
    const userProfile = await User.findOne({username: user.user.username})
    if(userProfile){
        res.send({
            success: true,
            profile: {
                games: userProfile.profile.games,
                wins: userProfile.profile.wins,
                loses: userProfile.profile.loses,
                heros: userProfile.profile.heros
            }
        })
        return
    }
    res.status(500).send({
        success: false
    })
};

export default profile;