import axios from "axios";
import { BOT_TOKEN, GROUP_ID, CHANNEL_ID } from "./config";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { client, collections } from "./mongo";
import { tronweb } from "./tronweb";

const Slimbot = require('slimbot');
const slimbot = new Slimbot(BOT_TOKEN);

// Check is member

const isMember = async (user_id: number, chat_id: string): Promise<boolean> => {
    try {
        const { data } = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`, { user_id, chat_id: `@${chat_id}` })

        // console.log({ data });

        return data?.result.status === 'left' ? false : true
    } catch (e) {
        console.error(e);
        return false
    }
}

// Register listeners

slimbot.on('message', async (message: Message) => {
    console.log({ message: JSON.stringify(message) });

    if (message.from.is_bot) return slimbot.sendMessage(message.from.id, 'message from bot is not supported').catch(console.error)
    if (message.chat.type !== 'private') return slimbot.sendMessage(message.from.id, 'only supporting for directly private message').catch(console.error)
    
    const session = client.startSession()
    session.startTransaction()

    try {

        const foundUser: User | null = await client.db().collection(collections.users).findOne({ id: message.from.id }, { session })

        if (foundUser) {
            await session.abortTransaction()
            session.endSession()

            return await slimbot.sendMessage(message.chat.id, `You have already claimed ${foundUser.amount} for address ${foundUser.address} at ${foundUser.createdAt}, txid: ${foundUser.txid}`)
        } else {
            if (message.text === '/start') return slimbot.sendMessage(message.chat.id, 'Please use enter a valid TRX address').catch(console.error)

            const [isGroupMember, isChannelMember] = await Promise.all([
                isMember(message.from.id, GROUP_ID),
                isMember(message.from.id, CHANNEL_ID),
            ])

            if (!isGroupMember) {
                await session.abortTransaction()
                session.endSession()

                return await Promise.all([
                    slimbot.sendMessage(message.chat.id, `You must be to join to the group ${GROUP_ID}`),
                    slimbot.sendMessage(message.chat.id, `https://t.me/${GROUP_ID}`)
                ])
            }

            if (!isChannelMember) {
                await session.abortTransaction()
                session.endSession()

                return await Promise.all([
                    slimbot.sendMessage(message.chat.id, `You must be to join to the channel ${CHANNEL_ID}`),
                    slimbot.sendMessage(message.chat.id, `https://t.me/${CHANNEL_ID}`)
                ])
            }

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
                slimbot.sendMessage(message.chat.id, `Congrats ${message.from?.first_name || ''} ${message.from?.last_name || ''}! You have been successful claimed ${amount} USDT for address ${address}.`),
                slimbot.sendMessage(message.chat.id, `https://tronscan.org/#/transaction/${txid}`),
                slimbot.sendMessage(`@${GROUP_ID}`, `Sent ${amount} USDT to ${address} of ${message.from.first_name + message.from.last_name}, txid: ${txid}`)
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