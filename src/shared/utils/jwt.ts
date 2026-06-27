import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { jwtPayload } from "@/modules/auth/auth.types";

export const generateAccessToken = (payload: jwtPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
}

export const generateRefreshToken = (payload: jwtPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string): jwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as jwtPayload
}

export const verifyRefreshToken = (token: string): jwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as jwtPayload
}