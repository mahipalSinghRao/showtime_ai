import { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "@/shared/utils/jwt";
import userRepository from "@/modules/user/user.repository";
import ApiError from "../errors/ApiError";


export const protect = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized")
        }

        const token = authHeader.split(" ")[1];

        const payload = verifyAccessToken(token)

        const user = await userRepository.findById(payload.userId)
        if (!user) {
            throw new ApiError(401, "Unauthorized")
        }
        req.user = payload;
        next()
    } catch (error) {
        next(error)
    }
}