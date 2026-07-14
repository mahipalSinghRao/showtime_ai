import asyncHandler from "@/shared/utils/asyncHandler";
import userService from "./user.service";
import ApiResponse from "@/shared/utils/ApiResponse";
import { Response, Request } from "express";

class UserController {
    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const id = req.user.userId;
        const result = await userService.updatedProfile(id, req.body)


        return res.status(200).json(
            new ApiResponse(
                200,
                "User profile updated successfully",
                result
            )
        );
    })
}

export default new UserController()