import { IndexSpecification } from "mongodb"

type Message = {
    "message_id": number,
    "from": {
        "id": number,
        "is_bot": boolean,
        "first_name": string,
        "last_name": string,
        "language_code": string
    }, "chat": {
        "id": number,
        "first_name": string,
        "last_name": string, "type": string
    },
    "date": number,
    "text": string
}

const MessageIndexes: IndexSpecification[] = [
    { key: { message_id: 1 }, unique: true },
    { key: { "from.id": 1 }, unique: true }
]

export { Message, MessageIndexes }

/*
{"message_id":51,"from":{"id":955188036,"is_bot":false,"first_name":"Le","last_name":"Phuong","language_code":"en"},"chat":{"id":955188036,"first_name":"Le","last_name":"Phuong","type":"private"},"date":1608046089,"text":"sajdasdas"}
*/