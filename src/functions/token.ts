/**
 * Validates JWT tokens used by the system
 */
import jwt from 'jsonwebtoken'

export async function validateJWT(token: string){
    try {
        var decoded = jwt.verify(token, `${process.env.SESSIONSECRECT}`);
        if (decoded) {
            return {
                auth: true,
                user: decoded
            };
        }
    } catch { }
    return {
        auth: false,
        user: null
    };
} 