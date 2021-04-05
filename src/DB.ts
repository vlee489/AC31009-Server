/*
Creates and holds the Database connections.
*/
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import mongoose from "mongoose";

const MongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    poolSize: 20,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

export const DB = mongoose.createConnection(process.env.MONGO_URI, MongoOptions);

