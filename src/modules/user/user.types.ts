import { HydratedDocument } from "mongoose";
import { UserRole } from "@/shared/constants/roles";

// export enum userRole {
//     USER = "USER",
//     ADMIN = "ADMIN"
// }

export interface IUser {
    fullName: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRole;
    isVerified: boolean;
    refreshToken?: string;
    lastLogin?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    fullName?: string;
    avatar?: string
}

export interface PublicUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    avatar: string;
    role: UserRole;
}

export type UserDocument = HydratedDocument<IUser>