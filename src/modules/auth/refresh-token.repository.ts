import { RefreshToken } from "./refresh-token.model";

class RefreshTokenRepository {
    async create(data: {
        user: string;
        tokenHash: string;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
    }) {
        return RefreshToken.create(data);
    }

    async findByHash(tokenHash: string) {
        return RefreshToken.findOne({
            tokenHash,
            revoked: false,
        })
    }

    async revoke(tokenHash: string) {
        return RefreshToken.findOneAndUpdate(
            { tokenHash },
            {
                revoked: true,
                revokedAt: new Date(),
            },
            { new: true, }
        );
    }

    async revokeAll(userId: string) {
        return RefreshToken.updateMany(
            {
                user: userId,
                revoked: false,
            },
            { revoked: true, revokedAt: new Date() }
        );
    }

    async deleteExpired() {
        return RefreshToken.deleteMany({
            expiresAt: {
                $lt: new Date(),
            },
        });
    }

    async getUserSessions(userId: string) {
        return RefreshToken.find({
            user: userId,
            revoked: false,
        }).sort({
            createdAt: -1,
        });
    }

    async findAnyByHash(tokenHash: string) {
        return RefreshToken.findOne({
            tokenHash,
        });
    }

}

export default new RefreshTokenRepository();