import userRepository from "./user.repository.ts"
import ApiError from "@/shared/errors/ApiError"
import { UpdateUserDto } from "./user.types.js"

class UserServices {
    async updatedProfile(userId: string, data: UpdateUserDto) {
        const user = await userRepository.updateProfile(userId, data)
        if (!user) {
            throw new ApiError(401, "User not found")
        }
        return;
    }
}

export default new UserServices()