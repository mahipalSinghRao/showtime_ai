export const responses = {
    Success: {
        description: "Request completed successfully",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ApiResponse",
                },
            },
        },
    },

    Created: {
        description: "Resource created successfully",
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ApiResponse",
                },
            },
        },
    },

    BadRequest: {
        description: "Validation failed",
    },

    Unauthorized: {
        description: "Authentication required",
    },

    Forbidden: {
        description: "Permission denied",
    },

    NotFound: {
        description: "Resource not found",
    },

    Conflict: {
        description: "Resource already exists",
    },

    TooManyRequests: {
        description: "Rate limit exceeded",
    },

    InternalServerError: {
        description: "Internal server error",
    },
};