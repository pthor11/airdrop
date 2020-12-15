import { API_HASH, API_ID } from "./config";

const { MTProto } = require('@mtproto/core');
const { sleep } = require('@mtproto/core/src/utils/common');

const mtproto = new MTProto({
    api_id: API_ID,
    api_hash: API_HASH,
});

const api = {
    call(method: string, params: object, options = {}) {
        return mtproto.call(method, params, options).catch(async (error: any) => {
            console.log(`${method} error:`, error);

            const { error_code, error_message } = error;

            if (error_code === 420) {
                const seconds = +error_message.split('FLOOD_WAIT_')[1];
                const ms = seconds * 1000;

                await sleep(ms);

                return this.call(method, params, options);
            }

            if (error_code === 303) {
                const [type, dcId] = error_message.split('_MIGRATE_');

                // If auth.sendCode call on incorrect DC need change default DC, because call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
                if (type === 'PHONE') {
                    await mtproto.setDefaultDc(+dcId);
                } else {
                    options = {
                        ...options,
                        dcId: +dcId,
                    };
                }

                return this.call(method, params, options);
            }

            return Promise.reject(error);
        });
    },
};

export { mtproto, api };