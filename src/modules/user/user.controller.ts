import asyncHandler from "@/shared/utils/asyncHandler";
import userService from "./user.service";
import ApiResponse from "@/shared/utils/ApiResponse";

class UserController {
    updateProfile = asyncHandler(async (req, res) => {
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