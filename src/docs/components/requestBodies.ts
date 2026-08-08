export const requestBodies = {
    RegisterRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: [
                        "fullName",
                        "username",
                        "email",
                        "password",
                    ],
                    properties: {
                        fullName: {
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

                        password: {
                            type: "string",
                            example: "Password@123",
                        },
                    },
                },
            },
        },
    },

    LoginRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: [
                        "email",
                        "password",
                    ],
                    properties: {
                        email: {
                            type: "string",
                            example: "mahipal@example.com",
                        },

                        password: {
                            type: "string",
                            example: "Password@123",
                        },
                    },
                },
            },
        },
    },

    CreateReviewRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: [
                        "movie",
                        "rating",
                        "comment",
                    ],
                    properties: {
                        movie: {
                            type: "string",
                        },

                        rating: {
                            type: "number",
                            example: 4.5,
                        },

                        comment: {
                            type: "string",
                            example: "Amazing movie.",
                        },
                    },
                },
            },
        },
    },

    UpdateReviewRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        rating: {
                            type: "number",
                            example: 5,
                        },

                        comment: {
                            type: "string",
                            example: "Updated review.",
                        },
                    },
                },
            },
        },
    },

    AddWatchlistRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: [
                        "movie",
                    ],
                    properties: {
                        movie: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },

    AIRecommendationRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: [
                        "prompt",
                    ],
                    properties: {
                        prompt: {
                            type: "string",
                            example: "Recommend sci-fi movies with time travel.",
                        },
                    },
                },
            },
        },
    },

    UpdateUserRequest: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        username: {
                            type: "string",
                        },
                        avatar: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
};