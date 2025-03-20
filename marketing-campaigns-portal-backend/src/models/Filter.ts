/*import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  conditions: { type: Array, required: true }, // Stores AND/OR conditions
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Filter = mongoose.model("Filter", filterSchema);
export default Filter;*/

import mongoose from "mongoose";

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
export default Filter;
