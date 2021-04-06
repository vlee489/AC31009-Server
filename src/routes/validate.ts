/**
 * Validate if a JWT token is valid from user
 */

import {validateJWT} from '../functions/token'

export const validateToken = async (req, res) => {
    if ('token' in req.body) {
        if ((await validateJWT(req.body.token)).auth) {
            res.send({
                success: true,
                valid: true
            })
            return
        } else {
            res.send({
                success: true,
                valid: false
            })
            return
        }
    }
    res.status(401).send({
        success: false,
        message: 'Incomplete credentials',
    })
};

export default validateToken;