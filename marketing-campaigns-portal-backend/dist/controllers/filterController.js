"use strict";
/*import { Request, Response } from "express";
import Filter from "../models/Filter";*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilter = exports.applyFilter = exports.previewAudience = exports.getSingleFilter = exports.getFilters = exports.duplicateFilter = exports.editFilter = exports.createOrUpdateFilter = void 0;
const User_1 = __importDefault(require("../models/User"));
const Filter_1 = __importDefault(require("../models/Filter"));
/*export const createOrUpdateFilter = async (req: Request, res: Response) => {
  try {
      const { name, description, tags, conditions, logicalOperator, customFields, isDraft } = req.body;

      // ✅ Validate required fields
      if (!name || !conditions || !logicalOperator) {
          return res.status(400).json({ message: "Name, conditions, and logicalOperator are required" });
      }

      // ✅ Validate conditions format
      if (!Array.isArray(conditions) || conditions.length === 0) {
          return res.status(400).json({ message: "Conditions should be an array of groups" });
      }

      // ✅ Identify Filter Type (Filter Components vs. Trigger Filters)
      const isTriggerFilter = tags?.includes("trigger");

      // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
      const structuredGroups = conditions.map((group: any) => {
          // 🚨 Enforce "AND" operator for Filter Components
          if (!isTriggerFilter && group.groupOperator !== "AND") {
              throw new Error("Filter Components groups must have an AND operator");
          }

          return {
              groupId: group.groupId || `Group_${Date.now()}`, // Generate unique ID if missing
              groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND", // ✅ Ensure AND for Filter Components
              criteria: group.criteria.map((condition: any) => ({
                  field: condition.field,
                  operator: condition.operator,
                  value: condition.value,
              })),
          };
      });

      // ✅ Handle Custom Fields
      let updatedCustomFields = {};
      if (customFields && typeof customFields === "object") {
          updatedCustomFields = customFields;
      }

      // ✅ Dummy Audience Estimation Logic
      const estimatedAudience = Math.floor(Math.random() * 10000);

      const newFilter = new Filter({
          name,
          description,
          tags,
          userId: "67daedeaff85ef645f71206f",
          conditions: structuredGroups,
          logicalOperator,
          customFields: updatedCustomFields,
          estimatedAudience,
          isDraft,
      });

      // ✅ Save to database
      await newFilter.save();
      res.status(201).json({ message: "Filter Saved Successfully", filter: newFilter });

  } catch (error: unknown) {
    console.error("Error saving filter:", error);

    // ✅ Ensure error is an instance of Error before accessing `message`
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(400).json({ message: "An unknown error occurred" });
    }
  }
}; */
const Campaign_1 = __importDefault(require("../models/Campaign")); // Import Campaign model
const createOrUpdateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, tags, conditions, logicalOperator, customFields, isDraft, campaignId } = req.body;
        // ✅ Validate required fields
        if (!name || !conditions || !logicalOperator || !campaignId) {
            return res.status(400).json({ message: "Name, conditions, logicalOperator, and campaignId are required" });
        }
        // ✅ Validate conditions format
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions should be an array of groups" });
        }
        // ✅ Fetch Campaign Type
        const campaign = yield Campaign_1.default.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        const { type } = campaign;
        // ✅ Identify Filter Type Based on Campaign Type
        let isTriggerFilter = false;
        if (type === "Real Time") {
            isTriggerFilter = true;
        }
        else if (type === "Criteria Based" || type === "Scheduled") {
            isTriggerFilter = false;
        }
        else {
            return res.status(400).json({ message: "Invalid campaign type" });
        }
        // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
        const structuredGroups = conditions.map((group) => {
            // 🚨 Enforce "AND" operator for Filter Components within each group
            if (!isTriggerFilter && group.groupOperator !== "AND") {
                throw new Error("Each group in Filter Components must have an AND operator.");
            }
            return {
                groupId: group.groupId || `Group_${Date.now()}`, // Generate unique ID if missing
                groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND", // ✅ Ensure AND for Filter Components within the group
                criteria: group.criteria.map((condition) => ({
                    field: condition.field,
                    operator: condition.operator,
                    value: condition.value,
                })),
            };
        });
        // 🚨 Enforce "OR" operator between groups for Filter Components
        if (!isTriggerFilter && logicalOperator !== "OR") {
            return res.status(400).json({ message: "Filter Components must have an OR operator between groups." });
        }
        // ✅ Handle Custom Fields
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields;
        }
        // ✅ Dummy Audience Estimation Logic
        const estimatedAudience = Math.floor(Math.random() * 10000);
        const newFilter = new Filter_1.default({
            name,
            description,
            tags,
            campaignId, // ✅ Store the campaignId in the filters table
            userId: "67daedeaff85ef645f71206f",
            conditions: structuredGroups,
            logicalOperator,
            customFields: updatedCustomFields,
            estimatedAudience,
            isDraft,
        });
        // ✅ Save to database
        yield newFilter.save();
        res.status(201).json({ message: "Filter Saved Successfully", filter: newFilter });
    }
    catch (error) {
        console.error("Error saving filter:", error);
        // ✅ Ensure error is an instance of Error before accessing `message`
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.createOrUpdateFilter = createOrUpdateFilter;
// ✅ Edit an Existing Filter with AND/OR Groups & Custom Fields
/*export const editFilter = async (req: Request, res: Response) => {
  try {
      const { filterId } = req.params;
      const { name, description, tags, conditions, logicalOperator, customFields, isDraft } = req.body;

      // ✅ Validate required fields
      if (!name || !conditions || !logicalOperator) {
          return res.status(400).json({ message: "Name, conditions, and logicalOperator are required" });
      }

      // ✅ Validate conditions format
      if (!Array.isArray(conditions) || conditions.length === 0) {
          return res.status(400).json({ message: "Conditions should be an array of groups" });
      }

      // ✅ Identify Filter Type (Filter Components vs. Trigger Filters)
      const isTriggerFilter = tags?.includes("trigger");

      // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
      const structuredGroups = conditions.map((group: any) => {
          // 🚨 Enforce "AND" operator for Filter Components within each group
          if (!isTriggerFilter && group.groupOperator !== "AND") {
              throw new Error("Each group in Filter Components must have an AND operator.");
          }

          return {
              groupId: group.groupId || `Group_${Date.now()}`, // Keep existing ID or generate new one
              groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND", // ✅ Ensure AND for Filter Components within the group
              criteria: group.criteria.map((condition: any) => ({
                  field: condition.field,
                  operator: condition.operator,
                  value: condition.value,
              })),
          };
      });

      // 🚨 Enforce "OR" operator between groups for Filter Components
      if (!isTriggerFilter && logicalOperator !== "OR") {
          return res.status(400).json({ message: "Filter Components must have an OR operator between groups." });
      }

      // ✅ Handle Custom Fields
      let updatedCustomFields = {};
      if (customFields && typeof customFields === "object") {
          updatedCustomFields = customFields;
      }

      // ✅ Dummy Audience Estimation Logic
      const estimatedAudience = Math.floor(Math.random() * 10000);

      // ✅ Find and update the filter
      const updatedFilter = await Filter.findOneAndUpdate(
          { _id: filterId, userId: "67daedeaff85ef645f71206f" },
          {
              name,
              description,
              tags,
              conditions: structuredGroups,
              logicalOperator,
              customFields: updatedCustomFields,
              estimatedAudience,
              isDraft,
              lastModified: new Date(),
          },
          { new: true }
      );

      if (!updatedFilter) {
          return res.status(404).json({ message: "Filter not found" });
      }

      res.status(200).json({ message: "Filter Updated Successfully", filter: updatedFilter });

  } catch (error: unknown) {
      console.error("Error updating filter:", error);

      // ✅ Ensure error is an instance of Error before accessing `message`
      if (error instanceof Error) {
          res.status(400).json({ message: error.message });
      } else {
          res.status(400).json({ message: "An unknown error occurred" });
      }
  }
};*/
// ✅ Edit an Existing Filter add campaign type with AND/OR Groups & Custom Fields
const editFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const { name, description, tags, conditions, logicalOperator, customFields, isDraft, campaignId } = req.body;
        // ✅ Validate required fields
        if (!name || !conditions || !logicalOperator || !campaignId) {
            return res.status(400).json({ message: "Name, conditions, logicalOperator, and campaignId are required" });
        }
        // ✅ Validate conditions format
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions should be an array of groups" });
        }
        // ✅ Fetch the campaign details to determine filter type
        const campaign = yield Campaign_1.default.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        const { type } = campaign;
        let isTriggerFilter = false;
        if (type === "Real Time") {
            isTriggerFilter = true;
        }
        else if (type === "Criteria Based" || type === "Scheduled") {
            isTriggerFilter = false;
        }
        else {
            return res.status(400).json({ message: "Invalid campaign type" });
        }
        // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
        const structuredGroups = conditions.map((group) => {
            // 🚨 Enforce "AND" operator for Filter Components within each group
            if (!isTriggerFilter && group.groupOperator !== "AND") {
                throw new Error("Each group in Filter Components must have an AND operator.");
            }
            return {
                groupId: group.groupId || `Group_${Date.now()}`, // Keep existing ID or generate new one
                groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND", // ✅ Ensure AND for Filter Components within the group
                criteria: group.criteria.map((condition) => ({
                    field: condition.field,
                    operator: condition.operator,
                    value: condition.value,
                })),
            };
        });
        // 🚨 Enforce "OR" operator between groups for Filter Components
        if (!isTriggerFilter && logicalOperator !== "OR") {
            return res.status(400).json({ message: "Filter Components must have an OR operator between groups." });
        }
        // ✅ Handle Custom Fields
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields;
        }
        // ✅ Dummy Audience Estimation Logic
        const estimatedAudience = Math.floor(Math.random() * 10000);
        // ✅ Find and update the filter
        const updatedFilter = yield Filter_1.default.findOneAndUpdate({ _id: filterId, userId: "67daedeaff85ef645f71206f" }, {
            name,
            description,
            tags,
            campaignId, // ✅ Store campaignId in the filters table
            conditions: structuredGroups,
            logicalOperator,
            customFields: updatedCustomFields,
            estimatedAudience,
            isDraft,
            lastModified: new Date(),
        }, { new: true });
        if (!updatedFilter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        res.status(200).json({ message: "Filter Updated Successfully", filter: updatedFilter });
    }
    catch (error) {
        console.error("Error updating filter:", error);
        // ✅ Ensure error is an instance of Error before accessing `message`
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.editFilter = editFilter;
// ✅ Duplicate a Filter
/*export const duplicateFilter = async (req: Request, res: Response) => {
  try {
    const { filterId } = req.params;
    const originalFilter = await Filter.findById(filterId);

    if (!originalFilter) {
      return res.status(404).json({ message: "Original filter not found" });
    }

    // ✅ Ensure toObject() returns an object
    const filterData = originalFilter.toObject() as Record<string, any>;

    delete filterData._id; // ✅ Remove _id to avoid MongoDB conflict
    filterData.name = `Copy of ${originalFilter.name}`;
    filterData.createdAt = new Date();

    const duplicatedFilter = new Filter(filterData);
    await duplicatedFilter.save();

    res.status(201).json({ message: "Filter Duplicated Successfully", filter: duplicatedFilter });
  } catch (error) {
    console.error("Error duplicating filter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}; */
const duplicateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const originalFilter = yield Filter_1.default.findById(filterId);
        if (!originalFilter) {
            return res.status(404).json({ message: "Original filter not found" });
        }
        // ✅ Convert document to plain object
        const filterData = originalFilter.toObject();
        delete filterData._id; // ✅ Remove _id to avoid MongoDB conflict
        delete filterData.createdAt; // ✅ Remove timestamp to reset creation time
        // ✅ Generate a unique name to allow multiple duplications
        filterData.name = `Copy of ${originalFilter.name} (${new Date().getTime()})`;
        // ✅ Ensure required fields are properly copied
        if (!filterData.campaignId) {
            return res.status(400).json({ message: "campaignId is required" });
        }
        // ✅ Validate and format conditions array
        if (Array.isArray(filterData.conditions)) {
            filterData.conditions = filterData.conditions.map((condition) => (Object.assign(Object.assign({}, condition), { groupOperator: condition.groupOperator || "AND" })));
        }
        else {
            return res.status(400).json({ message: "Invalid conditions format" });
        }
        const duplicatedFilter = new Filter_1.default(filterData);
        yield duplicatedFilter.save();
        res.status(201).json({ message: "Filter Duplicated Successfully", filter: duplicatedFilter });
    }
    catch (error) {
        console.error("Error duplicating filter:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.duplicateFilter = duplicateFilter;
// ✅ Get All Filters for a User
// export const getFilters = async (req: Request, res: Response) => {
//   try {
//     const filters = await Filter.find({ /*userId: req.user.id*/ /*userId: (req as any).user.id,*/ userId: "67daedeaff85ef645f71206f" });
//     res.status(200).json(filters);
//   } catch (error) {
//     console.error("Error fetching filters:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// ✅ Get All Filters for a User with Pagination, Search & Sorting 
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = "67daedeaff85ef645f71206f"; // Static userId (Replace with actual user authentication)
        // Extract query parameters
        let { page = "1", limit = "10", search = "", sortBy = "createdAt", order = "desc" } = req.query;
        // Convert page & limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        // Search filter (case-insensitive search by name)
        const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {};
        // Sorting order (ascending or descending)
        const sortOrder = order === "asc" ? 1 : -1;
        // Fetch filters with pagination, search & sorting
        const filters = yield Filter_1.default.find(Object.assign({ userId }, searchQuery))
            .sort({ [sortBy]: sortOrder }) // Dynamic sorting
            .skip(skip)
            .limit(limitNumber);
        // Get total count for pagination
        const totalFilters = yield Filter_1.default.countDocuments(Object.assign({ userId }, searchQuery));
        const totalPages = Math.ceil(totalFilters / limitNumber);
        res.status(200).json({
            success: true,
            message: "Filters fetched successfully",
            filters,
            pagination: {
                total: totalFilters,
                page: pageNumber,
                limit: limitNumber,
                totalPages
            }
        });
    }
    catch (error) {
        console.error("Error fetching filters:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFilters = getFilters;
// ✅ Get a Single Filter with Grouping Logic
/*export const getSingleFilter = async (req: Request, res: Response) => {
  try {
    const filterId = req.params.filterId;

    // Fetch filter and ensure conditions are populated
    const filter = await Filter.findById(filterId).lean();

    if (!filter) {
      return res.status(404).json({ message: "Filter not found" });
    }

    if (!filter.conditions || filter.conditions.length === 0) {
      return res.status(200).json({
        message: "No conditions found for this filter",
        filter: { ...filter, groups: [] }
      });
    }

    // Group conditions by groupId
    const groupedConditions: Record<string, any[]> = {};

    filter.conditions.forEach((condition: any) => {
      if (condition?.groupId && condition?.criteria) {
        const groupId = condition.groupId;
        if (!groupedConditions[groupId]) {
          groupedConditions[groupId] = [];
        }
        
        // Extract criteria inside each group (if stored as nested array)
        condition.criteria.forEach((criteria: any) => {
          groupedConditions[groupId].push({
            field: criteria.field,
            operator: criteria.operator,
            value: criteria.value,
          });
        });
      }
    });

    // Convert groups into structured format
    const groups = Object.keys(groupedConditions).map(groupId => ({
      groupId,
      conditions: groupedConditions[groupId], // AND conditions within a group
    }));

    res.status(200).json({
      id: filter._id,
      name: filter.name,
      description: filter.description,
      tags: filter.tags,
      lastUsed: filter.lastUsed,
      ctr: filter.ctr,
      createdOn: filter.createdAt,
      audienceCount: filter.estimatedAudience,
      groups, // Groups with AND conditions, joined by OR operator
    });
  } catch (error) {
    console.error("Error fetching filter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};*/
// ✅ Get a Single Filter with Grouping Logic and Campaign Type
const getSingleFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterId = req.params.filterId;
        // Fetch filter along with campaign details
        const filter = yield Filter_1.default.findById(filterId).lean();
        if (!filter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        if (!filter.conditions || filter.conditions.length === 0) {
            return res.status(200).json({
                message: "No conditions found for this filter",
                filter: Object.assign(Object.assign({}, filter), { groups: [] })
            });
        }
        // ✅ Fetch campaign details using campaignId
        let type = null;
        if (filter.campaignId) {
            const campaign = yield Campaign_1.default.findById(filter.campaignId).lean();
            if (campaign) {
                type = campaign.type;
            }
        }
        // ✅ Group conditions by groupId
        const groupedConditions = {};
        filter.conditions.forEach((condition) => {
            if ((condition === null || condition === void 0 ? void 0 : condition.groupId) && (condition === null || condition === void 0 ? void 0 : condition.criteria)) {
                const groupId = condition.groupId;
                if (!groupedConditions[groupId]) {
                    groupedConditions[groupId] = {
                        groupOperator: condition.groupOperator || "AND", // ✅ Include groupOperator
                        conditions: []
                    };
                }
                // Extract criteria inside each group
                condition.criteria.forEach((criteria) => {
                    groupedConditions[groupId].conditions.push({
                        field: criteria.field,
                        operator: criteria.operator,
                        value: criteria.value,
                    });
                });
            }
        });
        // ✅ Convert groups into structured format
        const groups = Object.keys(groupedConditions).map(groupId => ({
            groupId,
            groupOperator: groupedConditions[groupId].groupOperator, // ✅ Include groupOperator for each group
            conditions: groupedConditions[groupId].conditions, // AND conditions within a group
        }));
        res.status(200).json({
            id: filter._id,
            name: filter.name,
            description: filter.description,
            tags: filter.tags,
            lastUsed: filter.lastUsed,
            ctr: filter.ctr,
            createdOn: filter.createdAt,
            audienceCount: filter.estimatedAudience,
            campaignId: filter.campaignId || null, // ✅ Include campaignId
            type, // ✅ Include campaignType from campaigns table
            customFields: filter.customFields || {}, // ✅ Include customFields from filters table
            logicalOperator: filter.logicalOperator || "OR", // ✅ Include logicalOperator for the entire filter
            groups, // Groups with AND conditions, joined by OR operator
        });
    }
    catch (error) {
        console.error("Error fetching filter:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSingleFilter = getSingleFilter;
// ✅ Preview Estimated Audience Based on Conditions
const previewAudience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conditions } = req.body;
        if (!conditions || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions are required for preview" });
        }
        // Dummy Audience Estimation Logic (Replace with real DB Query)
        const estimatedAudience = Math.floor(Math.random() * 10000);
        res.status(200).json({ estimatedAudience, message: "Audience preview generated successfully" });
    }
    catch (error) {
        console.error("Error generating audience preview:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.previewAudience = previewAudience;
// Apply filter to get matching users
const applyFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const filter = yield Filter_1.default.findById(filterId);
        if (!filter)
            return res.status(404).json({ message: "Filter not found" });
        let query = {};
        let andConditions = [];
        let orConditions = [];
        filter.conditions.forEach((cond) => {
            if (cond.operator === "AND") {
                query["$and"] = andConditions;
            }
            else if (cond.operator === "OR") {
                query["$or"] = orConditions;
            }
            else {
                const condition = { [cond.field]: { [`$${cond.operator}`]: cond.value } };
                andConditions.push(condition);
                orConditions.push(condition);
            }
        });
        const users = yield User_1.default.find(query);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error applying filter", error });
    }
});
exports.applyFilter = applyFilter;
// ✅ Delete a Filter
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const filter = yield Filter_1.default.findOneAndDelete({ _id: filterId, /*userId: req.user.id*/
            /*userId: (req as any).user.id*/
            userId: "67daedeaff85ef645f71206f"
        });
        if (!filter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        res.status(200).json({ message: "Filter deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting filter:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteFilter = deleteFilter;
