"use strict";
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
/*import { Request, Response } from "express";
import Filter from "../models/Filter";*/
const User_1 = __importDefault(require("../models/User"));
const Filter_1 = __importDefault(require("../models/Filter"));
/*export const createOrUpdateFilter = async (req: Request, res: Response) => {
  try {
    const { name, description, tags, conditions, logicalOperator, isDraft } = req.body;

    if (!name || !conditions || !logicalOperator) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Dummy Audience Estimation Logic (Replace with real logic)
    const estimatedAudience = Math.floor(Math.random() * 10000);

    const newFilter = new Filter({
      name,
      description,
      tags,
      // userId: (req as any).user.id,
      userId: "67daedeaff85ef645f71206f",
      conditions,
      logicalOperator,
      estimatedAudience,
      isDraft,
    });

    await newFilter.save();
    res.status(201).json({ message: "Filter Saved Successfully", filter: newFilter });
  } catch (error) {
    console.error("Error saving filter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/
const createOrUpdateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, tags, conditions, logicalOperator, customFields, isDraft } = req.body;
        if (!name || !conditions || !logicalOperator) {
            return res.status(400).json({ message: "Name, conditions, and logicalOperator are required" });
        }
        // ✅ Validate conditions format
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions should be an array of groups" });
        }
        // ✅ Dummy Audience Estimation Logic (Replace with real logic)
        const estimatedAudience = Math.floor(Math.random() * 10000);
        // ✅ Handle Custom Fields (Adding new custom fields)
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields; // Store custom fields if provided
        }
        const newFilter = new Filter_1.default({
            name,
            description,
            tags,
            userId: "67daedeaff85ef645f71206f",
            conditions, // ✅ Now storing grouped conditions
            logicalOperator,
            customFields: updatedCustomFields, // Store custom fields
            estimatedAudience,
            isDraft,
        });
        yield newFilter.save();
        res.status(201).json({ message: "Filter Saved Successfully", filter: newFilter });
    }
    catch (error) {
        console.error("Error saving filter:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createOrUpdateFilter = createOrUpdateFilter;
// ✅ Edit an Existing Filter
/*export const editFilter = async (req: Request, res: Response) => {
  try {
    const { filterId } = req.params;
    const updatedData = req.body;

    const filter = await Filter.findOneAndUpdate(
      { _id: filterId,     // userId: (req as any).user.id,
        userId: "67daedeaff85ef645f71206f", },
      updatedData,
      { new: true }
    );

    if (!filter) {
      return res.status(404).json({ message: "Filter not found" });
    }

    res.status(200).json({ message: "Filter Updated Successfully", filter });
  } catch (error) {
    console.error("Error updating filter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/
// ✅ Edit an Existing Filter with AND/OR Groups & Custom Fields
const editFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const { name, description, tags, groups, isDraft, customFields } = req.body;
        // Validation: Ensure required fields are present
        if (!name || !groups || !Array.isArray(groups) || groups.length === 0) {
            return res.status(400).json({ message: "Invalid filter structure. Groups must be provided." });
        }
        // Ensure each group contains at least one condition
        for (const group of groups) {
            if (!group.conditions || !Array.isArray(group.conditions) || group.conditions.length === 0) {
                return res.status(400).json({ message: `Each group must contain at least one condition.` });
            }
        }
        // Processing groups to maintain the AND/OR structure
        const updatedGroups = groups.map((group) => ({
            groupId: group.groupId || `Group_${Date.now()}`, // Assign a unique Group ID if missing
            conditions: group.conditions.map((condition) => ({
                field: condition.field,
                operator: condition.operator,
                value: condition.value
            })),
        }));
        // Handle Custom Fields: Adding & Updating
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields; // Store custom fields if provided
        }
        // Calculate estimated audience size (Dummy Logic)
        const estimatedAudience = Math.floor(Math.random() * 10000);
        // Update the filter document in the database
        const updatedFilter = yield Filter_1.default.findOneAndUpdate({ _id: filterId, userId: "67daedeaff85ef645f71206f" }, {
            name,
            description,
            tags,
            groups: updatedGroups, // Store structured groups
            estimatedAudience,
            isDraft,
            customFields: updatedCustomFields, // Store updated custom fields
            lastModified: new Date(),
        }, { new: true });
        if (!updatedFilter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        res.status(200).json({ message: "Filter Updated Successfully", filter: updatedFilter });
    }
    catch (error) {
        console.error("Error updating filter:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.editFilter = editFilter;
// ✅ Duplicate a Filter
const duplicateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const originalFilter = yield Filter_1.default.findById(filterId);
        if (!originalFilter) {
            return res.status(404).json({ message: "Original filter not found" });
        }
        // ✅ Ensure toObject() returns an object
        const filterData = originalFilter.toObject();
        delete filterData._id; // ✅ Remove _id to avoid MongoDB conflict
        filterData.name = `Copy of ${originalFilter.name}`;
        filterData.createdAt = new Date();
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
const getSingleFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterId = req.params.filterId;
        // Fetch filter and ensure conditions are populated
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
        // Group conditions by groupId
        const groupedConditions = {};
        filter.conditions.forEach((condition) => {
            if ((condition === null || condition === void 0 ? void 0 : condition.groupId) && (condition === null || condition === void 0 ? void 0 : condition.criteria)) {
                const groupId = condition.groupId;
                if (!groupedConditions[groupId]) {
                    groupedConditions[groupId] = [];
                }
                // Extract criteria inside each group (if stored as nested array)
                condition.criteria.forEach((criteria) => {
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
