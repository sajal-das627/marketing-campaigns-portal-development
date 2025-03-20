import request from "supertest";
import app from "../src/app";

describe("🚀 Filter Builder API", () => {
  it("should create a new filter", async () => {
    const res = await request(app)
      .post("/api/filters")
      .send({
        name: "VIP Customers",
        conditions: [{ field: "age", operator: ">", value: 30 }]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "VIP Customers");
  });

  it("should return all filters", async () => {
    const res = await request(app).get("/api/filters");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
