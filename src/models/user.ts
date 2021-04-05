/**
 * User Mongoose Model
 */
import { DB } from "../db"
import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcrypt'

const { Schema } = mongoose;
import { UserDocument, UserModel, UserSchema } from "../interfaces/mongoose.gen";

const UserSchema: UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: {
            unique: true
        },
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profile: {
        games: {
            type: Number,
            default: 0,
            require: true
        },
        wins: {
            type: Number,
            default: 0,
            require: true
        },
        loses: {
            type: Number,
            default: 0,
            require: true
        },
        heros: [{
            heroID: Number,
            plays: Number,
            wins: Number,
            loses: Number,
        }]
    }
}, {
    collection: "users"
});

/**
 * Used to update the password before committing to the database by hashing using bcrypt
 */
UserSchema.pre('save', function (this: UserDocument, next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(12, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Checks the user's password
 */
UserSchema.methods.validatePassword = async function validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
};

export const User: UserModel = DB.model<UserDocument, UserModel>("User", UserSchema);
export default User;