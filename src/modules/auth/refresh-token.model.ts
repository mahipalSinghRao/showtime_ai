import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
    user: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    revoked: {
        type: Boolean,
        default: false,
    },

    userAgent: {
        type: String,
    },

    ipAddress: {
        type: String,
    },
}, { timestamps: true })

refreshTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, }
);

export const RefreshToken = model<IRefreshToken>(
    "RefreshToken",
    refreshTokenSchema
);