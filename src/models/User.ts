import { IndexSpecification } from "mongodb"


type User = {
    id: number
    first_name: string
    last_name: string
    language_code: string
    address: string
    amount: number
    txid?: string
    createdAt: Date
}

const UserIndexes: IndexSpecification[] = [
    { key: { id: 1 }, unique: true },
    { key: { address: 1 }, unique: true }
]

export {
    User,
    UserIndexes
}