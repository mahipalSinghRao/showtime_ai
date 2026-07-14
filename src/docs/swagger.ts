// import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { schemas } from "./components/schemas";
import { responses } from "./components/responses";
import { requestBodies } from "./components/requestBodies";

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
                description: "Local Development",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas,
            responses,
            requestBodies,
        },

        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: [
        "src/modules/**/*.ts",
    ],

});