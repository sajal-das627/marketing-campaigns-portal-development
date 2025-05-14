import { Types } from 'mongoose';

export interface CriteriaSchema{
    field: string;
    operator: string;
    value: any;
}

export interface ConditionGroup{
    map(buildGroupStatement: (group: ConditionGroup) => string): unknown;
    groupId: string;
    groupOperator: 'AND' | 'OR';
    criteria: CriteriaSchema[],
}

export interface Filter{
    name: string;
    description?: string;
    tags?: string;
    userId: Types.ObjectId;
    conditions: ConditionGroup[];
    logicalOperator: 'AND' | 'OR';
    estimatedAudience: number;   
    isDraft: boolean;  
    lastUsed: string;  
    ctr: number; 
    createdAt: Date; 
    updatedAt: Date; 
    lastModified: Date;
    customFields: Map<string, string>;
}

// const FilterSchema = new mongoose.Schema({
//   name: { type: String, required: true },  
//   description: { type: String },  
//   tags: [{ type: String }],  
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
//   conditions: [ConditionGroupSchema], // ✅ Store groups instead of flat conditions
//   logicalOperator: { type: String, enum: ["AND", "OR"], required: true },   // ✅ Operator between groups
//   estimatedAudience: { type: Number, default: 0 },  
//   isDraft: { type: Boolean, default: false },  
//   lastUsed: { type: String, default: "Never" },  
//   ctr: { type: Number, default: 0 },  
//   createdAt: { type: Date, default: Date.now },  
//   lastModified: { type: Date, default: Date.now },
//    // ✅ Add customFields as a flexible object (key-value pairs)
//    customFields: { 
//     type: Map, 
//     of: String, // or `mongoose.Schema.Types.Mixed` for flexibility 
//     default: {} 
//   }
// });