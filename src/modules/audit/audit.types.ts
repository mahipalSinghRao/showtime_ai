import { HydratedDocument, Types } from "mongoose";

export enum AuditAction {

    LOGIN = "LOGIN",

    LOGOUT = "LOGOUT",

    REGISTER = "REGISTER",

    REFRESH_TOKEN = "REFRESH_TOKEN",

    AI_RECOMMENDATION = "AI_RECOMMENDATION",

    MOVIE_SYNC = "MOVIE_SYNC",

    REVIEW_CREATE = "REVIEW_CREATE",

    REVIEW_DELETE = "REVIEW_DELETE",

    WATCHLIST_ADD = "WATCHLIST_ADD",

    WATCHLIST_REMOVE = "WATCHLIST_REMOVE"

}

export interface IAudit {

    user?: Types.ObjectId;

    action: AuditAction;

    resource: string;

    success: boolean;

    ip?: string;

    userAgent?: string;

    requestId?: string;

    metadata?: Record<string, unknown>;

    createdAt: Date;

}

export interface CreateAuditDto extends Omit<IAudit, "createdAt"> { }

export type AuditDocument = HydratedDocument<IAudit>;