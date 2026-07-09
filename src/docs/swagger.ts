import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Showtime AI API",
            version: "1.0.0",
            description: "Production-grade AI Powered Movie Platform",
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
            },
        ],
    },

    apis: [
        path.join(__dirname, "../modules/**/*.ts"),
    ],
});