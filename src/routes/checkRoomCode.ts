import { checkRoomCode } from '../gameRouter'
import { validateJWT } from '../functions/token'

export const checkRoomCodePost = async (req, res) => {
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
        if (('roomCode' in req.body)) {
            const response = checkRoomCode(req.body.roomCode, userCred.user.id)
            if(response){
                res.status(200).send()
            }else{
                res.status(403).send()
            }
        }else{
            res.status(400).send({
                success: false,
                message: "missing field: roomCode"
            })
            return 
        }
    }
}

export default checkRoomCodePost