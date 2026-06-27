import { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/AppError"
import { env } from "../../config/env";
import ApiError from "../errors/ApiError";
import { ZodError } from "zod";


const errMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack:
                env.NODE_ENV === "production" ? err.stack : undefined
        })
    } else if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: err.issues,
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            stack: env.NODE_ENV === "development"
                ? err.stack
                : undefined,
        })
    }



}
export default errMiddleware;