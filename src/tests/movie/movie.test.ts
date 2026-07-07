import request from "supertest";
import app from "@/app";
import mongoose from "mongoose";

describe("Movie API", () => {

    beforeAll(async () => {
        console.log("Mongo Ready:", mongoose.connection.readyState);
    });

    it("should return movies", async () => {

        const response = await request(app)
            .get("/api/v1/movie");

        console.log("Mongo Ready:", mongoose.connection.readyState);
        console.log(response.body);

        expect(response.status).toBe(200);
    });

});