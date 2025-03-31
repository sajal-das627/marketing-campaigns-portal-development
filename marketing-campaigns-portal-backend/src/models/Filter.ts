/*import mongoose from "mongoose";

const ConditionSchema = new mongoose.Schema({
  field: { type: String, required: true },  
  operator: { type: String, required: true },  
  value: { type: mongoose.Schema.Types.Mixed, required: true },  
  groupId: { type: String, required: false },  
});

const FilterSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String },  
  tags: [{ type: String }],  
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  conditions: [ConditionSchema],  
  logicalOperator: { type: String, enum: ["AND", "OR", "BOTH"], required: true },  
  estimatedAudience: { type: Number, default: 0 },  
  isDraft: { type: Boolean, default: false },  
  lastUsed: { type: String, default: "Never" },  
  ctr: { type: Number, default: 0 },  
  createdAt: { type: Date, default: Date.now },  
});

const Filter = mongoose.model("Filter", FilterSchema);
export default Filter;*/

import mongoose from "mongoose";

const CriteriaSchema = new mongoose.Schema({
  field: { type: String, required: true },  
  operator: { type: String, required: true },  
  value: { type: mongoose.Schema.Types.Mixed, required: true },  
});

const ConditionGroupSchema = new mongoose.Schema({
  groupId: { type: String, required: true },  // ✅ Unique Group Identifier
  groupOperator: { type: String, enum: ["AND", "OR"], required: true }, // ✅ Dynamic AND/OR selection for Trigger Filters
  criteria: [CriteriaSchema], // ✅ Each group has multiple criteria
});

const FilterSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String },  
  tags: [{ type: String }],  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },  // ✅ Store Campaign ID
  conditions: [ConditionGroupSchema], // ✅ Store groups instead of flat conditions
  logicalOperator: { type: String, enum: ["AND", "OR"], required: true },   // ✅ Operator between groups
  estimatedAudience: { type: Number, default: 0 },  
  isDraft: { type: Boolean, default: false },  
  lastUsed: { type: String, default: "Never" },  
  ctr: { type: Number, default: 0 },  
  createdAt: { type: Date, default: Date.now },  
  lastModified: { type: Date, default: Date.now },
   // ✅ Add customFields as a flexible object (key-value pairs)
   customFields: { 
    type: Map, 
    of: String, // or `mongoose.Schema.Types.Mixed` for flexibility 
    default: {} 
  }
});

const Filter = mongoose.model("Filter", FilterSchema);
export default Filter;
