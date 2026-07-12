import request from "supertest";
import app from "@/app";
// import mongoose from "mongoose";

// describe("Movie API", () => {

//     beforeAll(async () => {
//         console.log("Mongo Ready:", mongoose.connection.readyState);
//     });

//     it("should return movies", async () => {

//         const response = await request(app)
//             .get("/api/v1/movies");

//         console.log("Mongo Ready:", mongoose.connection.readyState);
//         console.log(response.body);

//         expect(response.status).toBe(200);
//         expect(response.body).toMatchObject({
//             success: true,
//             statusCode: 200,
//         });

//         expect(Array.isArray(response.body.data.movies)).toBe(true);
//     });
// });

describe("Movie API", () => {

    it("should return movies", async () => {

        const response = await request(app)
            .get("/api/v1/movies");

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            statusCode: 200,
            message: "Movies fetched successfully",
        });

        expect(Array.isArray(response.body.data.movies)).toBe(true);

        expect(response.body.data.pagination).toMatchObject({
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPage: expect.any(Number),
            hasNextPage: expect.any(Boolean),
            hasPreviousPage: expect.any(Boolean),
        });

    });

});