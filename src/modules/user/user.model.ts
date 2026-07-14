import { Schema, model } from "mongoose";
import { IUser } from "./user.types";
import { UserRole } from "../../shared/constants/roles";

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    avatar: {
        type: String,
        default: "",
    },

    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    refreshToken: {
        type: String,
        default: "",
        select: false,
    },

    lastLogin: Date,

    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.index({ email: 1 })
userSchema.index({ username: 1 })

export const User = model<IUser>("User", userSchema)