import { IUser } from "./user.types";
import { User } from "./user.model";

class UserRepository {
    async create(data: Partial<IUser>) {
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
    async findByUserName(userName: string) {
        return User.findOne({
            userName
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
};


export default new UserRepository();