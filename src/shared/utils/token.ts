import { UserDocument } from "@/modules/user/user.types";

export const createTokenPayload = (
    user: UserDocument
) => ({
    userId: user.id,
    email: user.email,
    role: user.role
});