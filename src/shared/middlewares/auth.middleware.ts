import { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "../utils/jwt";
import userRepository from "@/modules/user/user.repository";
import ApiError from "../errors/ApiError";


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log("Authorization Header:", req.headers.authorization);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized", null)
        }

        const token = authHeader.split(" ")[1];
        // console.log("Token:", token);
        const payload = verifyAccessToken(token)
        // console.log("Payload:", payload);
        const user = await userRepository.findById(payload.userId)
        if (!user) {
            throw new ApiError(401, "Unauthorized", null)
        }
        req.user = payload;
        next()
    } catch (error) {
        next(error)
    }
}