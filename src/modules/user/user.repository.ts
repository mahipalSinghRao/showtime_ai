import { User } from "./user.model";
import { CreateUserDto, UpdateUserDto } from "./user.types";

class UserRepository {
    async create(data: CreateUserDto) {
        return User.create(data)
    }
    async findById(id: string) {
        return User.findById(id)
    }
    async findByEmail(email: string) {
        return User.findOne({
            email
        }).select("+password +refreshToken")
    }
    async updateProfile(userId: string, data: UpdateUserDto) {
        return User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        })
    }
    async findByUserName(username: string) {
        return User.findOne({
            username
        })
    }
    async updateRefreshToken(userId: string, refreshToken: string) {
        return User.findByIdAndUpdate(userId, { refreshToken }, { new: true })
    }
    async clearRefreshToken(userId: string) {
        return User.findByIdAndUpdate(
            userId,
            {
                refreshToken: "",
            }
        );
    }

    async updateLastLogin(userId: string, data: UpdateUserDto) {
        return User.findByIdAndUpdate(
            userId,
            data,
            {
                new: true,
                runValidators: true,
                select: "-password -refreshToken"
            }
        );
    }

    async existsByEmail(email: string) {
        return User.exists({ email })
    }

    async existsByUserName(username: string) {
        return User.exists({ username })
    }
};


export default new UserRepository();