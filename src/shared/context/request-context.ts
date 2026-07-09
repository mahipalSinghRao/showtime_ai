import { Request } from "express";

export interface RequestContext {
    userId?: string;
    ip?: string;
    userAgent?: string;
    requestId?: string;
}

export const getRequestContext = (req: Request): RequestContext => ({
    userId: req.user?.userId,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.headers["x-request-id"] as string | undefined,
})