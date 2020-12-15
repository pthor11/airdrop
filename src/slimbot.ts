import { BOT_TOKEN } from "./config";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { client, collections } from "./mongo";
import { tronweb } from "./tronweb";

const Slimbot = require('slimbot');
const slimbot = new Slimbot(BOT_TOKEN);

// Register listeners

slimbot.on('message', async (message: Message) => {
    console.log({ message });

    if (message.from.is_bot) return slimbot.sendMessage(message.chat.id, 'message from bot is not supported').catch(console.error)
    if (message.chat.type !== 'private') return slimbot.sendMessage(message.chat.id, 'only supporting for directly private message').catch(console.error)
    if (message.text === '/start') return slimbot.sendMessage(message.chat.id, 'Please enter your TRX address below').catch(console.error)

    const session = client.startSession()
    session.startTransaction()

    try {

        const foundUser: User | null = await client.db().collection(collections.users).findOne({ id: message.from.id }, { session })

        if (foundUser) {
            await session.abortTransaction()
            session.endSession()

            return await slimbot.sendMessage(message.chat.id, `You have already claimed ${foundUser.amount} for address ${foundUser.address} at ${foundUser.createdAt}, txid: ${foundUser.txid}`)
        } else {
            const address = message.text

            if (!tronweb.isAddress(address)) return slimbot.sendMessage(message.chat.id, `Invalid TRX address. Please re-enter a valid TRX address`)

            const amount = 100
            const txid = '522ec77217e13e0839b6e503e089d27c4157d60d11787bc0a963162a231e53ac'

            const user: User = {
                id: message.from.id,
                first_name: message.from.first_name,
                last_name: message.from.last_name,
                language_code: message.from.language_code,
                amount,
                address,
                txid,
                createdAt: new Date()
            }

            console.log({ user });

            const { insertedId } = await client.db().collection(collections.users).insertOne(user, { session })

            console.log({ insertedId });

            await session.commitTransaction()
            session.endSession()

            return await Promise.all([
                slimbot.sendMessage(message.chat.id, `Congrats ${message.from.first_name} ${message.from.last_name}! You have been successful claimed ${amount} USDT for address ${address}.`),
                slimbot.sendMessage(message.chat.id, `https://tronscan.org/#/transaction/${txid}`)
            ])
        }
    } catch (e) {
        await session.abortTransaction()
        session.endSession()

        console.error(e);

        slimbot.sendMessage(message.chat.id, JSON.stringify(e.message || e))
    }
});

// Call API

const startPolling = () => slimbot.startPolling()

export {
    slimbot,
    startPolling
}