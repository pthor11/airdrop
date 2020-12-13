import { config } from "dotenv";

config()

if (!process.env.API_ID) throw new Error(`API_ID must be provided`)
const API_ID = process.env.API_ID

if (!process.env.API_HASH) throw new Error(`API_HASH must be provided`)
const API_HASH = process.env.API_HASH

export {
    API_ID,
    API_HASH
}