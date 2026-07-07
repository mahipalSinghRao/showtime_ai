import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

const notFoundMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    next(
        new AppError(
            `Route ${req.originalUrl} not found`,
            404
        )
    );
}

export default notFoundMiddleware;