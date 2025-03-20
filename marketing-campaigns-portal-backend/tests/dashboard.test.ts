import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

let authToken: string;

// ✅ Before All Tests: Connect to DB & Authenticate User
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  // ✅ Mock Authentication & Get Token
  const loginRes = await request(app).post("/api/auth/okta-login").send({
    email: "testuser@example.com",
    password: "Test@123",
  });
  authToken = loginRes.body.token;
});

// ✅ After All Tests: Disconnect from DB
afterAll(async () => {
  await mongoose.connection.close();
});

// ✅ Test: Fetch Dashboard Data
describe("🚀 Dashboard API", () => {
  it("✅ Should fetch dashboard statistics", async () => {
    const res = await request(app)
      .get("/api/dashboard")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("activeCampaigns");
    expect(res.body).toHaveProperty("scheduledCampaigns");
    expect(res.body).toHaveProperty("totalAudience");
    expect(res.body).toHaveProperty("emailsSent");
    expect(res.body).toHaveProperty("engagementMetrics");
    expect(res.body).toHaveProperty("recentActivity");
  });
});
