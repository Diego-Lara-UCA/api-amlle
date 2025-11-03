import * as crypto from 'crypto';

export default class CryptoUtil {
    public static Create12BytesString(): string {
        return crypto.randomBytes(12).toString('base64');
    }
}