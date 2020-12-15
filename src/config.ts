import { config } from "dotenv";

config()

if (!process.env.MONGO) throw new Error(`MONGO must be provided`)
const MONGO = process.env.MONGO

if (!process.env.API_ID) throw new Error(`API_ID must be provided`)
const API_ID = process.env.API_ID

if (!process.env.API_HASH) throw new Error(`API_HASH must be provided`)
const API_HASH = process.env.API_HASH

if (!process.env.BOT_TOKEN) throw new Error(`BOT_TOKEN must be provided`)
const BOT_TOKEN = process.env.BOT_TOKEN

export {
    MONGO,
    API_ID,
    API_HASH,
    BOT_TOKEN
}