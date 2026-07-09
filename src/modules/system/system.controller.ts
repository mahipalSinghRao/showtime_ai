import ApiResponse from "@/shared/utils/ApiResponse";
import asyncHandler from "@/shared/utils/asyncHandler";
import systemService from "./system.service";

class SystemController {

    health = asyncHandler(async (_req, res) => {
        const result = await systemService.health();

        return res.json(
            new ApiResponse(
                200,
                "Healthy",
                result
            )
        );
    });

    ready = asyncHandler(async (_req, res) => {
        const result = await systemService.ready();

        return res.json(
            new ApiResponse(
                200,
                "Ready",
                result
            )
        );
    });

    version = asyncHandler(async (_req, res) => {
        const result = await systemService.version();

        return res.json(
            new ApiResponse(
                200,
                "Version",
                result
            )
        );
    });

    metrics = asyncHandler(async (_req, res) => {
        const result = await systemService.metrics();

        return res.json(
            new ApiResponse(
                200,
                "Metrics fetched successfully",
                result
            )
        );

    });

}

export default new SystemController();