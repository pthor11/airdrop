// import { mtproto, api } from "./api";
// import { API_HASH, API_ID, BOT_TOKEN } from "./config";

// const Slimbot = require('slimbot');
// const slimbot = new Slimbot(BOT_TOKEN);

// Register listeners


// slimbot.on('message', (message: any) => {
//     console.log({message: JSON.stringify(message)});

//     if (message.text === '/start') {

//         slimbot.sendMessage(message.chat.id, 'Please enter a valid TRX address');
//     }

    
//     // slimbot.sendMessage(-1001415313656, 'bot got message then sent to group');
// });

// Call API

// slimbot.startPolling();

// const start = async () => {
//     try {

//         // const sendCode = await api.call('auth.sendCode', {
//         //     phone_number: '+840942391867',
//         //     settings: {
//         //         _: 'codeSettings',
//         //     },
//         // })

//         // console.log({ sendCode });

//         // const smsCode = await api.call('auth.codeTypeSms', {})

//         // console.log({smsCode});

//         // const defaultDC = await mtproto.setDefaultDc(5)

//         // console.log({ defaultDC });


//         // console.log({ app_id: API_ID, api_hash: API_HASH, bot_auth_token: BOT_TOKEN });


//         // const signIn = await api.call('auth.importBotAuthorization', { app_id: API_ID, api_hash: API_HASH, bot_auth_token: BOT_TOKEN }/* , { syncAuth: false } */)

//         // console.log({ signIn });

//         // mtproto.updates.on('updates', (data: any) => {
//         //     console.log(JSON.stringify(data))
//         // });

//         // const getFullChannel = await api.call('channels.getFullChannel', {
//         //     channel: {
//         //         _: 'inputChannel',
//         //         channel_id: 'it52info',

//         //     }
//         // })

//         // console.log({ getFullChannel });


//     } catch (e) {
//         console.error({ e })
//     }
// }

// start()