import { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/AppError"
import { env } from "../../config/env";

const errMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: [],
        stack:
            process.env.NODE_ENV === "development"
                ? error.stack
                : undefined,
    });
}
export default errMiddleware;