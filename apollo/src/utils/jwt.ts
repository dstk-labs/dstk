import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

export interface Session {
    dateCreated: number;
    userId: string;
    iat: number;
    exp: number;
}
export type PartialSession = Omit<Session, "iat" | "exp">;

export class JWTValidator {
    // again, obviously a placeholder until I get a proper secrets
    // manager implemented that can populate these values at runtime
    key: string = 'asdfasdfasdfasdfasdfasdfasdfasdf';

    encodeSession(partialSession: PartialSession): string {
        const issued = Date.now();
        const expires = issued + (15 * 60);
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

        return signedJWT;
    }

    verifySession(tokenString: string) {
        const decoded = verify(
            tokenString,
            this.key, {
                algorithms: ['HS512'],
                maxAge: '3h',
            },
        );
        return decoded;
    }
}