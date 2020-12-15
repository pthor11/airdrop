import { mtproto, api } from "./api";
import { API_HASH, API_ID, BOT_TOKEN } from "./config";

const start = async () => {
    try {

        // const sendCode = await api.call('auth.sendCode', {
        //     phone_number: '+840942391867',
        //     settings: {
        //         _: 'codeSettings',
        //     },
        // })

        // console.log({ sendCode });

        // const smsCode = await api.call('auth.codeTypeSms', {})

        // console.log({smsCode});


        const user = await mtproto.call('users.getFullUser', {
            id: {
                _: 'inputUserSelf',
            },
        })

        console.log({ user });

        const signIn = await api.call('auth.importBotAuthorization', { app_id: API_ID, api_hash: API_HASH, bot_auth_token: BOT_TOKEN }/* , { syncAuth: false } */)

        console.log({ signIn });

        mtproto.updates.on('updates', (data: any) => {
            console.log(JSON.stringify(data))
        });

        const getFullChat = await api.call('messages.getFullChat', {
            chat_id: -1001415313656
        })

        console.log({ getFullChat });

    } catch (e) {
        console.error({ e })
    }
}

start()