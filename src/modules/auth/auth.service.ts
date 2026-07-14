import userRepository from "../user/user.repository";
import { CreateUserDto, UserDocument } from "../user/user.types";
import { comparePassword, hashPassword } from "@/shared/utils/password";
import { toPublicUser } from "@/shared/utils/user";
import ApiError from "@/shared/errors/ApiError";
import { generateAuthTokens } from "@/shared/utils/auth";
import { LoginUserDto } from "./auth.types";
import { verifyRefreshToken } from "@/shared/utils/jwt";
import refreshTokenRepository from "./refresh-token.repository";
import { hashToken } from "@/shared/utils/token";
import { RequestContext } from "@/shared/context/request-context";
import auditService from "../audit/audit.service";


class AuthService {
    private async buildAuthResponse(
        user: UserDocument,
        userAgent?: string,
        ipAddress?: string) {
        const tokens = generateAuthTokens(user);

        await refreshTokenRepository.create({
            user: user.id,
            tokenHash: hashToken(tokens.refreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userAgent,
            ipAddress,
        })

        // await userRepository.updateRefreshToken(
        //     user.id,
        //     tokens.refreshToken
        // );

        return {
            user: toPublicUser(user),
            tokens
        };
    }
    async register(data: CreateUserDto, context?: RequestContext) {
        const [emailExists, usernameExists] = await Promise.all([
            userRepository.existsByEmail(data.email),
            userRepository.existsByUserName(data.username)
        ])

        if (emailExists) {
            throw new ApiError(409, "Email already exists")
        }

        if (usernameExists) {
            throw new ApiError(409, "Username already exists")
        }
        const hashedPassword = await hashPassword(data.password)

        const user = await userRepository.create({ ...data, password: hashedPassword })

        const response = await this.buildAuthResponse(user);

        await auditService.logLogin(
            true,
            context
        );

        return response;
    }

    async login(data: LoginUserDto, context?: RequestContext) {
        const user = await userRepository.findByEmail(data.email)
        if (!user) {
            throw new ApiError(401, "Invalid Credentials")
        }

        const isMatched = await comparePassword(data.password, user.password)
        if (!isMatched) {
            throw new ApiError(401, "Invalid Credentials")
        }

        const response = await this.buildAuthResponse(user);

        await auditService.logLogin(
            true,
            context
        );

        return response;

    }

    async refreshToken(
        refreshToken: string,
        context?: RequestContext
    ) {
        if (!refreshToken) {
            throw new ApiError(
                401,
                "Refresh token missing"
            );
        }

        const payload = verifyRefreshToken(refreshToken);

        const tokenHash = hashToken(refreshToken);

        const existingToken =
            await refreshTokenRepository.findAnyByHash(
                tokenHash
            );

        if (!existingToken) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (existingToken.revoked) {
            await refreshTokenRepository.revokeAll(
                payload.userId
            );

            throw new ApiError(
                401,
                "Refresh token reuse detected. Please login again."
            );
        }

        const user =
            await userRepository.findById(
                payload.userId
            );

        if (!user) {
            throw new ApiError(
                401,
                "User not found"
            );
        }


        await refreshTokenRepository.revoke(
            tokenHash
        );

        await auditService.logRefreshToken(
            true,
            context
        );

        return this.buildAuthResponse(
            user,
            context?.userAgent,
            context?.ip
        );
    }

    async logout(refreshToken: string, context?: RequestContext) {
        if (!refreshToken) {
            throw new ApiError(401, "Unauthorized");
        }
        const tokenHash = hashToken(refreshToken);
        await refreshTokenRepository.revoke(tokenHash);
        await auditService.logLogout(
            true,
            context
        );
        return;
    }

    async getMe(userId: string) {
        const user = await userRepository.findById(userId)

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }
        return user;
    }

    async logoutAll(userId: string) {
        await refreshTokenRepository.revokeAll(userId);
        return;
    }
}
export default new AuthService()