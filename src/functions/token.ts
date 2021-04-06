/**
 * Validates JWT tokens used by the system
 */
import jwt from 'jsonwebtoken'

interface user {
    id: string,
    email: string,
    username: string,
    iat: number
}

export interface validateJWT{
    auth: boolean,
    user: null | user
}

export async function validateJWT(token: string): Promise<validateJWT>{
    try {
        var decoded = jwt.verify(token, `${process.env.SESSIONSECRECT}`);
        if (decoded) {
            return {
                auth: true,
                user: decoded as user  // I hate typescript resolver nonsense
            };
        }
    } catch { }
    return {
        auth: false,
        user: null
    };
} 