import { NextFunction, Request, Response } from "express";
import { UserRole } from "../constants/roles";
import ApiError from "../errors/ApiError";

export const authorize = (role: UserRole) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = req.user;
        if (!users || users.role !== role) {
            throw new ApiError(404, "Forbidden")
        }
        next()
    } catch (error) {
        next(error)
    }
}