import { UserDocument } from "@/modules/user/user.types";
import { createTokenPayload } from "./token";
import { generateAccessToken, generateRefreshToken } from "./jwt";

export const generateAuthTokens = (
    user: UserDocument
) => {
    const payload =
        createTokenPayload(user);

    return {
        accessToken:
            generateAccessToken(payload),
        refreshToken:
            generateRefreshToken(payload),
    };
};