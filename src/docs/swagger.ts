import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Showtime AI API",
            version: "1.0.0",
            description:
                "Production-grade AI Powered Movie Platform"
        },

        servers: [
            {
                url: "http://localhost:5000/api/v1"
            }
        ]
    },

    apis: [
        "./src/modules/**/*.ts"
    ]
};

export const swaggerSpec =
    swaggerJsdoc(options);