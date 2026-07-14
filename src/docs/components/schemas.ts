export const schemas = {
    ApiResponse: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: true,
            },

            statusCode: {
                type: "integer",
                example: 200,
            },

            message: {
                type: "string",
                example: "Request successful",
            },

            data: {
                type: "object",
            },
        },
    },

    Pagination: {
        type: "object",
        properties: {
            page: {
                type: "integer",
                example: 1,
            },

            limit: {
                type: "integer",
                example: 20,
            },

            total: {
                type: "integer",
                example: 100,
            },

            totalPage: {
                type: "integer",
                example: 5,
            },

            hasNextPage: {
                type: "boolean",
                example: true,
            },

            hasPreviousPage: {
                type: "boolean",
                example: false,
            },
        },
    },

    User: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },

            name: {
                type: "string",
                example: "Mahipal Singh",
            },

            username: {
                type: "string",
                example: "mahipal",
            },

            email: {
                type: "string",
                example: "mahipal@example.com",
            },

            role: {
                type: "string",
                example: "user",
            },
        },
    },

    Movie: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },

            title: {
                type: "string",
            },

            overview: {
                type: "string",
            },

            poster: {
                type: "string",
            },

            backdrop: {
                type: "string",
            },

            rating: {
                type: "number",
                example: 8.7,
            },

            releaseDate: {
                type: "string",
                example: "2025-08-01",
            },
        },
    },

    Review: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },

            rating: {
                type: "number",
                example: 5,
            },

            comment: {
                type: "string",
            },
        },
    },

    Watchlist: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },

            movie: {
                $ref: "#/components/schemas/Movie",
            },
        },
    },
};