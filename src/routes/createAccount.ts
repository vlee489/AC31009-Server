import User from '../models/user'

/**
 * Create Account with system
 */
export const createAccount = async (req, res) => {
    if (('email' in req.body) && ('password' in req.body) && 
    ('firstName' in req.body) && ('lastName' in req.body) && ('username' in req.body)) {
        const {email, password, username, firstName, lastName} = req.body;
        const usernameCheck = await User.findOne({username: username})
        const emailCheck = await User.findOne({email: email})
        if(usernameCheck){
            res.status(409).send({
                success: false,
                message: 'Username in use',
            })
        }
        if(emailCheck){
            res.status(409).send({
                success: false,
                message: 'Account with email already exists',
            })
        }
        // Create new account in DB
        try{
            const newUser = await User.create({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                username: username
            })
            if(newUser){
                res.send({
                    success: true,
                })
                return
            }
        }catch{
            res.status(500).send()
        }

    }
    res.status(400).send({
        success: false,
        message: 'Incomplete details',
    })
};

export default createAccount