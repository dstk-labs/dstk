import pkg, { JwtPayload } from 'jsonwebtoken';
import { ObjectionRefreshToken } from '../graphql/user/user.js';
import { AccountError } from './errors.js';
import { v4 as uuidv4 } from 'uuid';
const { sign, verify } = pkg;

export interface Session {
    jti: string;
    tokenFamily?: string;
    sub: string;
    iat: number;
    exp: number;
}

export type PartialSession = Omit<Session, 'jti' | 'iat' | 'exp'>;

type JwtType =
    | 'refresh'
    | 'access';

export class JWTValidator {
    // again, obviously a placeholder until I get a proper secrets
    // manager implemented that can populate these values at runtime
    key: string = 'asdfasdfasdfasdfasdfasdfasdfasdf';

    encodeSession(partialSession: PartialSession, jwtType: JwtType): string {
        const issued = Date.now();

        const fifteenMinutes = 15 * 60 * 1000;
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const expires = (jwtType === 'refresh') ? issued + oneWeek : issued + fifteenMinutes;
        const session: Session = {
            ...partialSession,
            jti: uuidv4(),
            iat: issued,
            exp: expires,
        };
        const signedJWT = sign(session, this.key, {
            algorithm: 'HS512',
        });

        return signedJWT;
    }

    async verifySession(tokenString: string, jwtType: JwtType) {
        const decoded = verify(tokenString, this.key, {
            algorithms: ['HS512'],
            maxAge: (jwtType === 'access') ? '7 days' : undefined,
        }) as JwtPayload;

        if (jwtType === 'refresh') {
            const userTokens = await ObjectionRefreshToken.query()
                .where({ userId: decoded.sub });
            const isRefreshTokenValid = userTokens.length > 0;

            if (!isRefreshTokenValid) {
                await ObjectionRefreshToken.query()
                    .delete()
                    .where({ sessionFamily: decoded.tokenFamily });
                throw new AccountError({ name: 'INVALID_REFRESH_TOKEN' });
            }
        }

        return decoded;
    }
}
//     if (!isRefreshTokenValid) {
//       await this.removeRefreshTokenFamilyIfCompromised(
//         refreshTokenContent.sub,
//         refreshTokenContent.tokenFamily,
//       );

//       throw new InvalidRefreshTokenException();
//     }

//     return true;
//   }

//   private async removeRefreshTokenFamilyIfCompromised(
//     userId: string,
//     tokenFamily: string,
//   ): Promise<void> {
//     const familyTokens = await this.prismaService.userTokens.findMany({
//       where: { userId, family: tokenFamily },
//     });

//     if (familyTokens.length > 0) {
//       await this.prismaService.userTokens.deleteMany({
//         where: { userId, family: tokenFamily },
//       });
//     }
//   }