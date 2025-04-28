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
const User_1 = __importDefault(require("../models/User"));
const Filter_1 = __importDefault(require("../models/Filter"));
/*export const createOrUpdateFilter = async (req: Request, res: Response) => {
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
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const { type } = campaign;

    // ✅ Identify Filter Type Based on Campaign Type
    let isTriggerFilter = false;
    if (type === "Real Time") {
      isTriggerFilter = true;
    } else if (type === "Criteria Based" || type === "Scheduled") {
      isTriggerFilter = false;
    } else {
      return res.status(400).json({ message: "Invalid campaign type" });
    }

    // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
    const structuredGroups = conditions.map((group: any) => {
      // 🚨 Enforce "AND" operator for Filter Components within each group
      if (!isTriggerFilter && group.groupOperator !== "AND") {
        throw new Error("Each group in Filter Components must have an AND operator.");
      }

      return {
        groupId: group.groupId || `Group_${Date.now()}`, // Generate unique ID if missing
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

    const newFilter = new Filter({
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
};*/
const createOrUpdateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, tags, conditions, logicalOperator, customFields, isDraft } = req.body;
        // ✅ Validate required fields
        if (!name || !conditions) {
            return res.status(400).json({ message: "Name and conditions are required." });
        }
        // ✅ Validate conditions array
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions should be an array of groups." });
        }
        // ✅ No Campaign validation anymore
        let isTriggerFilter = false; // 🔥 By default, treat as Filter Components (isTriggerFilter = false)
        const structuredGroups = conditions.map((group, index) => {
            if (index === 0) {
                // First Group
                if (!isTriggerFilter && group.groupOperator !== "AND") {
                    throw new Error("In Filter Components, Group 1 must have an AND operator.");
                }
                // For Trigger Filters, we allow both AND/OR in Group 1 (if we bring back campaign later)
            }
            else {
                if (!isTriggerFilter && group.groupOperator !== "AND") {
                    throw new Error("Each group in Filter Components must have an AND operator.");
                }
            }
            return {
                groupId: group.groupId || `Group_${Date.now()}`,
                groupOperator: isTriggerFilter
                    ? group.groupOperator || "OR"
                    : "AND",
                criteria: group.criteria.map((condition) => ({
                    field: condition.field,
                    operator: condition.operator,
                    value: condition.value,
                })),
            };
        });
        // ✅ Handle logicalOperator properly
        let finalLogicalOperator = undefined;
        if (conditions.length === 1) {
            // Only one group
            finalLogicalOperator = "OR"; // Always set OR if only one group
        }
        else {
            // More than one group
            if (!isTriggerFilter) {
                if (!logicalOperator || logicalOperator !== "OR") {
                    return res.status(400).json({ message: "Filter Components must have an OR operator between groups." });
                }
                finalLogicalOperator = "OR";
            }
            else {
                if (!logicalOperator || (logicalOperator !== "AND" && logicalOperator !== "OR")) {
                    return res.status(400).json({ message: "Trigger Filters must have AND/OR operator between groups." });
                }
                finalLogicalOperator = logicalOperator;
            }
        }
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields;
        }
        const estimatedAudience = Math.floor(Math.random() * 10000);
        // ✅ Build the new filter document (without campaignId)
        const newFilter = new Filter_1.default({
            name,
            description,
            tags,
            userId: "67daedeaff85ef645f71206f", // ✅ Hardcoded userId
            conditions: structuredGroups,
            logicalOperator: finalLogicalOperator,
            customFields: updatedCustomFields,
            estimatedAudience,
            isDraft,
        });
        yield newFilter.save();
        res.status(201).json({ message: "Filter Saved Successfully", filter: newFilter });
    }
    catch (error) {
        console.error("Error saving filter:", error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.createOrUpdateFilter = createOrUpdateFilter;
// ✅ Edit an Existing Filter add campaign type with AND/OR Groups & Custom Fields
/*export const editFilter = async (req: Request, res: Response) => {
  try {
    const { filterId } = req.params;
    const {
      name,
      description,
      tags,
      conditions,
      logicalOperator,
      customFields,
      isDraft,
      campaignId,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !conditions || !logicalOperator || !campaignId) {
      return res.status(400).json({
        message: "Name, conditions, logicalOperator, and campaignId are required",
      });
    }

    // ✅ Validate conditions format
    if (!Array.isArray(conditions) || conditions.length === 0) {
      return res.status(400).json({
        message: "Conditions should be an array of groups",
      });
    }

    // ✅ Fetch the campaign details to determine filter type
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const { type } = campaign;

    let isTriggerFilter = false;
    if (type === "Real Time") {
      isTriggerFilter = true;
    } else if (type === "Criteria Based" || type === "Scheduled") {
      isTriggerFilter = false;
    } else {
      return res.status(400).json({ message: "Invalid campaign type" });
    }

    // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
    const structuredGroups = conditions.map((group: any) => {
      // 🚨 Enforce "AND" operator for Filter Components within each group
      if (!isTriggerFilter && group.groupOperator !== "AND") {
        throw new Error("Each group in Filter Components must have an AND operator.");
      }

      return {
        groupId: group.groupId || `Group_${Date.now()}`,
        groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND",
        criteria: group.criteria.map((condition: any) => ({
          field: condition.field,
          operator: condition.operator,
          value: condition.value,
        })),
      };
    });

    // 🚨 Enforce "OR" operator between groups for Filter Components
    if (!isTriggerFilter && logicalOperator !== "OR") {
      return res.status(400).json({
        message: "Filter Components must have an OR operator between groups.",
      });
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
        campaignId,
        conditions: structuredGroups,
        logicalOperator,
        customFields: updatedCustomFields,
        estimatedAudience,
        isDraft,
        lastModified: new Date(),
      },
      { new: true }
    ).lean();

    if (!updatedFilter) {
      return res.status(404).json({ message: "Filter not found" });
    }

    // ✅ Attach campaign type to the response
    const responseWithType = {
      ...updatedFilter,
      campaignType: type,
    };

    res.status(200).json({
      message: "Filter Updated Successfully",
      filter: responseWithType,
    });
  } catch (error: unknown) {
    console.error("Error updating filter:", error);

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};*/
// campaignId removed from editFilter function
const editFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const { name, description, tags, conditions, logicalOperator, customFields, isDraft, } = req.body;
        // ✅ Validate required fields
        if (!name || !conditions) {
            return res.status(400).json({
                message: "Name and conditions are required.",
            });
        }
        // ✅ Validate conditions format
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({
                message: "Conditions should be an array of groups.",
            });
        }
        // ✅ No Campaign check anymore
        let isTriggerFilter = false; // 🔥 Default assume it is Filter Components (not Trigger Filters)
        // ✅ Processing Conditions (Handling Filter Components & Trigger Filters Logic)
        const structuredGroups = conditions.map((group, index) => {
            if (index === 0) {
                // ✅ Group 1 validation
                if (!isTriggerFilter && group.groupOperator !== "AND") {
                    throw new Error("In Filter Components, Group 1 must have an AND operator.");
                }
                // ✅ Trigger Filters: allow AND/OR for Group 1
            }
            else {
                // ✅ Group 2, Group 3, etc
                if (!isTriggerFilter && group.groupOperator !== "AND") {
                    throw new Error("Each group in Filter Components must have an AND operator.");
                }
                // ✅ Trigger Filters: allow AND/OR between groups
            }
            return {
                groupId: group.groupId || `Group_${Date.now()}`,
                groupOperator: isTriggerFilter ? group.groupOperator || "OR" : "AND",
                criteria: group.criteria.map((condition) => ({
                    field: condition.field,
                    operator: condition.operator,
                    value: condition.value,
                })),
            };
        });
        // ✅ Enforce logicalOperator validation
        if (conditions.length > 1) {
            if (!isTriggerFilter && logicalOperator !== "OR") {
                return res.status(400).json({
                    message: "Filter Components must have an OR operator between groups.",
                });
            }
            if (isTriggerFilter && (!logicalOperator || (logicalOperator !== "AND" && logicalOperator !== "OR"))) {
                return res.status(400).json({
                    message: "Trigger Filters must have an AND or OR operator between groups.",
                });
            }
        }
        // ✅ Handle Custom Fields
        let updatedCustomFields = {};
        if (customFields && typeof customFields === "object") {
            updatedCustomFields = customFields;
        }
        // ✅ Dummy Audience Estimation Logic
        const estimatedAudience = Math.floor(Math.random() * 10000);
        // ✅ Find and update the filter (no campaignId anymore)
        const updatedFilter = yield Filter_1.default.findOneAndUpdate({ _id: filterId, userId: "67daedeaff85ef645f71206f" }, {
            name,
            description,
            tags,
            conditions: structuredGroups,
            logicalOperator: conditions.length === 1 ? "OR" : logicalOperator,
            customFields: updatedCustomFields,
            estimatedAudience,
            isDraft,
            lastModified: new Date(),
        }, { new: true }).lean();
        if (!updatedFilter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        // ✅ Response without campaignType (because campaign is removed)
        res.status(200).json({
            message: "Filter Updated Successfully",
            filter: updatedFilter,
        });
    }
    catch (error) {
        console.error("Error updating filter:", error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.editFilter = editFilter;
// ✅ Duplicate a Filter with Conditions
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
        delete filterData.createdAt; // ✅ Remove createdAt to reset creation time
        delete filterData.campaignId; // ✅ Remove campaignId completely
        // ✅ Generate a unique name for duplicated filter
        filterData.name = `Copy of ${originalFilter.name}`;
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
// ✅ Get All Filters for a User with Pagination, Search & Sorting 
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = "67daedeaff85ef645f71206f"; // Static userId (Replace with actual user authentication)
        // Extract query parameters
        let { page = "1", limit = "10", search = "", sortBy = "createdAt", order = "desc", isDraft } = req.query;
        // Convert page & limit to numbers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        // Search filter (case-insensitive search by name)
        const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {};
        // Draft filter logic
        let draftFilter = {};
        if (isDraft !== undefined) {
            draftFilter = { isDraft: isDraft === "true" }; // Convert string to boolean
        }
        // Sorting order (ascending or descending)
        const sortOrder = order === "asc" ? 1 : -1;
        // Combine all filters
        const query = Object.assign(Object.assign({ userId }, searchQuery), draftFilter);
        // Fetch filters (no populate for campaignId anymore)
        const filters = yield Filter_1.default.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNumber);
        // Get total count for pagination
        const totalFilters = yield Filter_1.default.countDocuments(query);
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
        // Fetch filter
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
            groupOperator: groupedConditions[groupId].groupOperator,
            conditions: groupedConditions[groupId].conditions,
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
            customFields: filter.customFields || {}, // ✅ Include customFields
            logicalOperator: filter.logicalOperator || "OR", // ✅ Include logicalOperator
            groups, // ✅ Groups with AND/OR conditions
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
        const filter = yield Filter_1.default.findOneAndDelete({
            _id: filterId, /*userId: req.user.id*/
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
