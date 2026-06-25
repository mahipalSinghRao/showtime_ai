import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(
        new AppError(
            404,
            `Route ${req.originalUrl} not found`
        )
    );
}

export default notFoundMiddleware;