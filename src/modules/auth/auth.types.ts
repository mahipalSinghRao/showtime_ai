import { UserRole } from "@/shared/constants/roles";
import { PublicUser } from "../user/user.types";

// export interface CreateUserDto {
//     fullName: string;
//     username: string;
//     email: string;
//     password: string;
// }

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface jwtPayload {
    userId: string;
    email: string;
    role: UserRole
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string
}

export interface LoginResponse {
    user: PublicUser;
    tokens: AuthTokens;
}