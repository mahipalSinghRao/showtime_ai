import { NextFunction, Request, Response } from "express";
import logger from "@/config/logger";

export const requestLoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info({
            requestId: req.headers["x-request-id"],
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        })
    })
    next();
}