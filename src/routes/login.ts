import jwt from 'jsonwebtoken'
import User from '../models/user'

/**
 * Login for application
 */
export const login = async (req, res) => {
    if (('email' in req.body) && ('password' in req.body)) {
        const { email, password } = req.body
        const loginUser = await User.findOne({ email: email })
        if (loginUser) {
            if (await loginUser.validatePassword(password)) {
                const token = jwt.sign({
                    id: loginUser._id,
                    email: loginUser.email,
                    username: loginUser.username
                }, `${process.env.SESSIONSECRECT}`);
                // Send token
                res.send({
                    success: true,
                    token,
                    details: {
                        email: loginUser.email,
                        username: loginUser.username
                    }
                })
                return
            }
        } else {
            res.status(401).send({
                success: false,
                message: 'Incorrect credentials',
            })
            return
        }
    }
    res.status(401).send({
        success: false,
        message: 'Incomplete credentials',
    })
};

export default login;