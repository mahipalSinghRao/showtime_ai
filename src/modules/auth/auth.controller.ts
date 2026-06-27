import authService from "./auth.service";
import ApiResponse from "@/shared/utils/ApiResponse";
import asyncHandler from "@/shared/utils/asyncHandler";
import { clearCookieToken, setRefreshTokenCookie } from "@/shared/utils/cookie";

class AuthController {

    register = asyncHandler(
        async (req, res) => {
            const result =
                await authService.register(req.body);

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
        const result = await authService.login(req.body);

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
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.refreshToken(refreshToken);
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
        await authService.logout(refreshToken)
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
}

export default new AuthController();