/*import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    content: { type: String, required: true }, // HTML or plain text content
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    version: { type: Number, default: 1 },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;*/

import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: false },
  type: { type: String, enum: ["Email", "SMS", "Basic", "Designed", "Custom"], required: true },
  category: { type: String, enum: ["Promotional", "Transactional", "Event Based", "Update", "Announcement", "Action", "Product", "Holiday"], required: true },
  tags: [{ type: String }],
  layout: { type: String, enum: ["Single Column", "Two Column", "Three Column"], required: true },
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: null },
  favorite: { type: Boolean, default: false },
  content: { type: Object, required: true }, // Stores template design data

  isDeleted: { type: Boolean, default: false }, // ✅ New Field for Soft Delete
  deletedAt: { type: Date, default: null }, // ✅ Timestamp for Deletion

  // ✅ Add versioning field
  version: { type: Number, default: 1 },
});

const Template = mongoose.model("Template", TemplateSchema);
export default Template;

