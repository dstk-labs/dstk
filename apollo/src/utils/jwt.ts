import pkg from 'jsonwebtoken';
const { sign } = pkg;

export interface Session {
    id: string;
    dateCreated: number;
    userId: string;
    iat: number;
    exp: number;
}
export type PartialSession = Omit<Session, "iat" | "exp">;
export interface EncodeResult {
    token: string;
    exp: number;
    iat: number;
}
export type DecodeResult =
    | {
        type: "valid";
        session: Session;
    } | {
        type: "integrity-error";
    } | {
        type: "invalid-token";
    };
export type ExpirationStatus = "expired" | "active" | "grace";

export class JWTValidator {
    // again, obviously a placeholder until I get a proper secrets
    // manager implemented that can populate these values at runtime
    key: string = 'asdfasdfasdfasdfasdfasdfasdfasdf';

    encodeSession(partialSession: PartialSession): EncodeResult {
        const issued = Date.now();
        const fifteenMinutesInMs = 15 * 60 * 1000;
        const expires = issued + fifteenMinutesInMs;
        const session: Session = {
            ...partialSession,
            iat: issued,
            exp: expires,
        };
        const signedJWT = sign(
            session,
            this.key, {
                algorithm: 'HS512',
            }
        );

        return {
            token: signedJWT,
            iat: issued,
            exp: expires,
        }
    }
    // decodeSession() {}
    // checkExpiration() {}
}