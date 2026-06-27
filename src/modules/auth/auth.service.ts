import userRepository from "../user/user.repository";
import { CreateUserDto, UserDocument } from "../user/user.types";
import { comparePassword, hashPassword } from "@/shared/utils/password";
import { toPublicUser } from "@/shared/utils/user";
import ApiError from "@/shared/errors/ApiError";
import { generateAuthTokens } from "@/shared/utils/auth";
import { AuthTokens, LoginResponse, LoginUserDto } from "./auth.types";
import { verifyRefreshToken } from "@/shared/utils/jwt";



class AuthService {
    private async buildAuthResponse(user: UserDocument) {
        const tokens = generateAuthTokens(user);

        await userRepository.updateRefreshToken(
            user.id,
            tokens.refreshToken
        );

        return {
            user: toPublicUser(user),
            tokens
        };
    }
    async register(data: CreateUserDto) {
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

        return this.buildAuthResponse(user)
    }

    async login(data: LoginUserDto) {
        const user = await userRepository.findByEmail(data.email)
        if (!user) {
            throw new ApiError(401, "Invalid Credentials")
        }

        const isMatched = await comparePassword(data.password, user.password)
        if (!isMatched) {
            throw new ApiError(401, "Invalid Credentials")
        }

        return this.buildAuthResponse(user)

    }

    async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new ApiError(
                401,
                "Refresh token missing"
            );
        }
        const payload = verifyRefreshToken(refreshToken);

        const user = await userRepository.findById(payload.userId)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (user.refreshToken !== refreshToken) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }
        return this.buildAuthResponse(user)
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw new ApiError(401, "Unauthorized");
        }
        const payload = verifyRefreshToken(refreshToken);
        await userRepository.clearRefreshToken(payload.userId);
        return;
    }
}
export default new AuthService()