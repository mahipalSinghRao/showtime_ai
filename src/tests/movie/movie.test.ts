import request from "supertest";
import app from "@/app";
import mongoose from "mongoose";

describe("Movie API", () => {

    beforeAll(async () => {
        console.log("Mongo Ready:", mongoose.connection.readyState);
    });

    it("should return movies", async () => {

        const response = await request(app)
            .get("/api/v1/movies");

        console.log("Mongo Ready:", mongoose.connection.readyState);
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

});