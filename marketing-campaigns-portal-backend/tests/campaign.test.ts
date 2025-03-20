/*import request from "supertest";
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
}); */

/*import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Campaign from "../src/models/Campaign";

// ✅ Mock Data
const mockCampaign = {
  name: "Test Campaign",
  type: "Scheduled",
  audience: new mongoose.Types.ObjectId(),
  template: new mongoose.Types.ObjectId(),
  status: "Draft",
  createdAt: new Date(),
  publishedDate: new Date(),
};

let createdCampaignId: string;

// ✅ Before All Tests: Connect to DB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

// ✅ After All Tests: Disconnect from DB
afterAll(async () => {
  await mongoose.connection.close();
});

// ✅ Test: Create Campaign
describe("🚀 Campaign APIs", () => {
  it("✅ Should create a new campaign", async () => {
    const res = await request(app).post("/api/campaigns").send(mockCampaign);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("campaign");
    createdCampaignId = res.body.campaign._id; // Store for later tests
  });

  // ✅ Test: Get All Campaigns
  it("✅ Should fetch all campaigns", async () => {
    const res = await request(app).get("/api/campaigns");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Get Single Campaign
  it("✅ Should fetch a single campaign", async () => {
    const res = await request(app).get(`/api/campaigns/${createdCampaignId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", createdCampaignId);
  });

  // ✅ Test: Update Campaign
  it("✅ Should update a campaign", async () => {
    const res = await request(app).put(`/api/campaigns/${createdCampaignId}`).send({ name: "Updated Campaign" });
    expect(res.statusCode).toBe(200);
    expect(res.body.campaign.name).toBe("Updated Campaign");
  });

  // ✅ Test: Pause/Resume Campaign
  it("✅ Should toggle campaign status", async () => {
    const res = await request(app).put(`/api/campaigns/${createdCampaignId}/pause-resume`);
    expect(res.statusCode).toBe(200);
    expect(["Paused", "Active"]).toContain(res.body.newStatus);
  });

  // ✅ Test: Duplicate Campaign
  it("✅ Should duplicate a campaign", async () => {
    const res = await request(app).post(`/api/campaigns/${createdCampaignId}/duplicate`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("campaign");
    expect(res.body.campaign.name).toContain("Copy of");
  });

  // ✅ Test: Delete Campaign
  it("✅ Should delete a campaign", async () => {
    const res = await request(app).delete(`/api/campaigns/${createdCampaignId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Campaign deleted successfully");
  });
});*/

import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Campaign from "../src/models/Campaign";

let authToken: string;
let createdCampaignId: string;

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

// ✅ Test: Get Campaign List
describe("🚀 Campaign APIs", () => {
  it("✅ Should fetch campaign list", async () => {
    const res = await request(app)
      .get("/api/campaigns")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Create/Update Campaign
  it("✅ Should create a new campaign", async () => {
    const res = await request(app)
      .post("/api/campaigns")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Spring Sale Campaign",
        type: "Scheduled",
        audience: new mongoose.Types.ObjectId(),
        template: new mongoose.Types.ObjectId(),
        status: "Draft",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("campaign");
    createdCampaignId = res.body.campaign._id; // Store for later tests
  });

  // ✅ Test: Get All Campaigns
  it("✅ Should fetch all campaigns", async () => {
    const res = await request(app)
      .get("/api/campaigns")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Edit Campaign
  it("✅ Should edit an existing campaign", async () => {
    const res = await request(app)
      .put(`/api/campaigns/${createdCampaignId}/edit`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Spring Sale Campaign",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.campaign.name).toBe("Updated Spring Sale Campaign");
  });

  // ✅ Test: Launch Campaign
  it("✅ Should launch a campaign", async () => {
    const res = await request(app)
      .put(`/api/campaigns/${createdCampaignId}/launch`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Campaign launched successfully");
  });

  // ✅ Test: Pause/Resume Campaign
  it("✅ Should pause/resume a campaign", async () => {
    const res = await request(app)
      .put(`/api/campaigns/${createdCampaignId}/pause-resume`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(["Paused", "On Going"]).toContain(res.body.campaign.status);
  });

  // ✅ Test: Duplicate Campaign
  it("✅ Should duplicate a campaign", async () => {
    const res = await request(app)
      .post(`/api/campaigns/${createdCampaignId}/duplicate`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.campaign.name).toContain("Copy of");
  });

  // ✅ Test: Delete Campaign
  it("✅ Should delete a campaign", async () => {
    const res = await request(app)
      .delete(`/api/campaigns/${createdCampaignId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Campaign deleted successfully");
  });
});


