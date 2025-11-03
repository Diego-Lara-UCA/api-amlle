//------- Set to Argon2idUtils service? -------------

import  * as argon2 from "argon2";

const exp: number = Number(process.env.ARGON2_MEMORY_COST_EXP || '16');
const OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** exp,
    timeCost: Number(process.env.ARGON2_TIME_COST || '3'),
    parallelism: Number(process.env.ARGON2_PARALLELISM || '1')
}

export default class Argon2idUtils {
    static async Encrypt(text: string): Promise<string> {
        const data = await argon2.hash(text, {
            type: OPTIONS.type,
            memoryCost: OPTIONS.memoryCost,
            timeCost: OPTIONS.timeCost,
            parallelism: OPTIONS.parallelism
        });
        return data;
    }

    /**
     * @param text Text to be compared
     * @param hash Hash code to be compared
     * @returns true if text and hash are equal, otherwise false
     */
    static async Compare(text: string, hash: string): Promise<boolean> {
        const data = await argon2.verify(hash, text);
        return data;
    }
}
