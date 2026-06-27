import { IUser, PublicUser } from "@/modules/user/user.types";

export const toPublicUser = (
    user: IUser & { _id: any }
): PublicUser => {
    return {
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "",
        role: user.role
    }
}