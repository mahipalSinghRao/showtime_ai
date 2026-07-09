import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import aiService from "./ai.service";
import ApiResponse from "@/shared/utils/ApiResponse";
import { getRequestContext } from "@/shared/context/request-context";

class AIController {
    recommend = asyncHandler(async (req: Request, res: Response) => {
        const result = await aiService.recommend(
            req.body.prompt,
            getRequestContext(req)
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Recommendation generated successfully",
                result
            )
        );
    })
}

export default new AIController();