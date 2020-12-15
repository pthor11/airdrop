import { MongoClient, Collection, ClientSession, Db } from "mongodb";
import { MONGO } from "./config";
import { UserIndexes } from "./models/User";
import { MessageIndexes } from "./models/Message";


let client: MongoClient
let db: Db

const collections = {
    users: 'users',
    // messages: 'messages'
}

const connectDB = async () => {
    try {
        client = await new MongoClient(MONGO, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ignoreUndefined: true
        }).connect()

        console.error('mongodb connected')

        await Promise.all([
            client.db().collection(collections.users).createIndexes(UserIndexes),
        ])

    } catch (e) {
        console.error('mongodb not connected')
        throw e;
    }
}

export {
    client,
    collections,
    connectDB
}