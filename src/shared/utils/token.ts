import { UserDocument } from "@/modules/user/user.types";
import crypto from "crypto";

export const createTokenPayload = (
    user: UserDocument
) => ({
    userId: user.id,
    email: user.email,
    role: user.role
});

export const hashToken = (token: string): string => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};