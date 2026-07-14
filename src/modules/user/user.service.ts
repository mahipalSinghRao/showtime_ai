import userRepository from "./user.repository"
import ApiError from "@/shared/errors/ApiError"
import { UpdateUserDto } from "./user.types.js"
import { toPublicUser } from "./user.mapper"

class UserServices {
    async updatedProfile(userId: string, data: UpdateUserDto) {
        const user = await userRepository.updateProfile(userId, data)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        return toPublicUser(user);
    }
}

export default new UserServices()