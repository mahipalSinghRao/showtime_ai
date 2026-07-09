import { getRequestContext } from "@/shared/context/request-context";
import authService from "./auth.service";
import ApiResponse from "@/shared/utils/ApiResponse";
import asyncHandler from "@/shared/utils/asyncHandler";
import { clearCookieToken, setRefreshTokenCookie } from "@/shared/utils/cookie";

class AuthController {

    register = asyncHandler(
        async (req, res) => {
            const result =
                await authService.register(req.body, getRequestContext(req));

            setRefreshTokenCookie(res, result.tokens.refreshToken)

            return res.status(201).json(
                new ApiResponse(
                    201,
                    "User registered successfully",
                    {
                        user: result.user,
                        accessToken: result.tokens.accessToken,
                    }
                )
            );
        }
    );

    login = asyncHandler(async (req, res) => {
        const result = await authService.login(req.body, getRequestContext(req));

        setRefreshTokenCookie(res, result.tokens.refreshToken)

        return res.status(201).json(
            new ApiResponse(
                201,
                "Login successfully",
                {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                }
            )
        )
    }
    )

    refreshToken = asyncHandler(async (req, res) => {
        const refToken = req.cookies.refreshToken;
        const result = await authService.refreshToken(
            refToken,
            getRequestContext(req)
        );
        setRefreshTokenCookie(res, result.tokens.refreshToken);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Token refreshed successfully",
                {
                    accessToken:
                        result.tokens.accessToken
                }
            )
        );
    })

    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        await authService.logout(refreshToken, getRequestContext(req))
        clearCookieToken(res)
        return res.status(201).json(
            new ApiResponse(
                200,
                "Logout successfully",
                null
            )
        )
    }
    )

    getMe = asyncHandler(async (req, res) => {
        const id = req.user.userId
        const user = await authService.getMe(id)
        return res.status(200).json(
            new ApiResponse(
                200,
                "User fetch successfully",
                user
            )
        )
    })

    logoutAll = asyncHandler(async (req, res) => {
        await authService.logoutAll(
            req.user.userId
        );

        clearCookieToken(res);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Logged out from all devices",
                null
            )
        );

    });
}

export default new AuthController();