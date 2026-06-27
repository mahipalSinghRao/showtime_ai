import { Response } from "express";
import { env } from "@/config/env";

export const setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
) => {

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearCookieToken = (res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
    });
}