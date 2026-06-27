import { PublicUser, UserDocument } from "./user.types";

export const toPublicUser = (
    user: UserDocument
): PublicUser => {
    return {
        id: user.id,

        fullName: user.fullName,

        username: user.username,

        email: user.email,

        avatar: user.avatar ?? "",

        role: user.role,
    }
}