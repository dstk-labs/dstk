export class Encoder {
    // TODO: Change this to include more fields
    encode(id: string) {
        return Buffer.from(id, 'utf8').toString('base64');
    }

    // TODO: Change this when more fields are included
    decode(encodedString: string) {
        return Buffer.from(encodedString, 'base64').toString('utf8');
    }
}
