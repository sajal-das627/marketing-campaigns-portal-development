import request from "supertest";
import app from "../src/app";

describe("🚀 Campaign API", () => {
  it("should create a campaign", async () => {
    const res = await request(app)
      .post("/api/campaigns")
      .send({
        name: "Spring Sale",
        type: "scheduled",
        audienceFilter: "filterId123",
        template: "templateId456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Spring Sale");
  });

  it("should return all campaigns", async () => {
    const res = await request(app).get("/api/campaigns");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
