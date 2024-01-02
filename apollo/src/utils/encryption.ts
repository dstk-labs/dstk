import * as crypto from 'crypto';
import * as argon2 from 'argon2';

function splitEncryptedText(encryptedText: string) {
    return {
        encryptedDataString: encryptedText.slice(56, -32),
        ivString: encryptedText.slice(0, 24),
        assocDataString: encryptedText.slice(24, 56),
        tagString: encryptedText.slice(-32),
    };
}

export class Security {
    encoding: BufferEncoding = 'hex';
    // process.env.CRYPTO_KEY should be a 32 BYTE key
    key: string = 'asdfasdfasdfasdfasdfasdfasdfasdf';

    encrypt(plaintext: string): string {
        const iv = crypto.randomBytes(12);
        const assocData = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('chacha20-poly1305', this.key, iv, {
            authTagLength: 16,
        });

        cipher.setAAD(assocData, { plaintextLength: Buffer.byteLength(plaintext) });

        const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return (
            iv.toString(this.encoding) +
            assocData.toString(this.encoding) +
            encrypted.toString(this.encoding) +
            tag.toString(this.encoding)
        );
    }

    decrypt(cipherText: string): string {
        const { encryptedDataString, ivString, assocDataString, tagString } =
            splitEncryptedText(cipherText);
        const iv = Buffer.from(ivString, this.encoding);
        const encryptedText = Buffer.from(encryptedDataString, this.encoding);
        const tag = Buffer.from(tagString, this.encoding);

        const decipher = crypto.createDecipheriv('chacha20-poly1305', this.key, iv, {
            authTagLength: 16,
        });
        decipher.setAAD(Buffer.from(assocDataString, this.encoding), {
            plaintextLength: encryptedDataString.length,
        });
        decipher.setAuthTag(Buffer.from(tag));

        const decrypted = decipher.update(encryptedText);
        return Buffer.concat([decrypted, decipher.final()]).toString();
    }
}

export class HashBrown {
    // again, obviously a placeholder until I get a proper secrets
    // manager implemented that can populate these values at runtime
    key: string = 'asdfasdfasdfasdfasdfasdfasdfasdf';
    async hash(password: string): Promise<string> {
        const hash = await argon2.hash(password, { secret: Buffer.from(this.key) });
        return hash;
    }

    async verify(hash: string, password: string): Promise<boolean> {
        const verified = await argon2.verify(hash, password, { secret: Buffer.from(this.key) });
        return verified;
    }
}
