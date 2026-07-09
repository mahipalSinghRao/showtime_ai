import { Schema, model } from "mongoose";
import { AuditAction, IAudit } from "./audit.types";

const auditSchema = new Schema<IAudit>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        action: {
            type: String,
            enum: Object.values(AuditAction),
            required: true,
        },

        resource: {
            type: String,
            required: true,
            trim: true,
        },

        success: {
            type: Boolean,
            required: true,
        },

        ip: String,

        userAgent: String,

        requestId: String,

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
        versionKey: false,
    }
);

auditSchema.index({ user: 1, createdAt: -1 });

auditSchema.index({ action: 1, createdAt: -1 });

auditSchema.index({ requestId: 1 });

auditSchema.index({ ip: 1 });

export const Audit = model<IAudit>(
    "Audit",
    auditSchema
);