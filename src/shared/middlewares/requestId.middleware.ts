import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export const requestId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const requestId =
        req.header("x-request-id") ??
        crypto.randomUUID();

    req.headers["x-request-id"] = requestId;

    res.setHeader(
        "x-request-id",
        requestId
    );

    next();
};