import { HydratedDocument, Types } from "mongoose";

export enum userRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface IUser {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    avatar?: string;
    role: userRole;
    isVerified: boolean;
    refreshToken?: string;
    lastLogin: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>