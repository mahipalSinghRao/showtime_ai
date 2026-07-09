import { Request } from "express";

export const getAuditContext = (req: Request) => {
    return {
        user: req.user?.userId,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        requestId: req.headers["x-request-id"] as string | undefined,
    };
};