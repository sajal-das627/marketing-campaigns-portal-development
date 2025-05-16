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
exports.toggleFavoriteTemplate = exports.getPastCampaignTemplates = exports.getFavoriteTemplates = exports.getRecentlyUsedTemplates = exports.permanentlyDeleteTemplate = exports.restoreTemplateById = exports.deleteTemplate = exports.duplicateTemplate = exports.updateTemplate = exports.previewShowTemplate = exports.previewTemplate = exports.getTemplateById = exports.getTemplatesByCategory = exports.getAllTemplates = exports.createTemplate = void 0;
const Template_1 = __importDefault(require("../models/Template"));
// Create a new template
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, category, tags, layout, content, favorite, includeOptOutText, // ✅ receive optional field
         } = req.body;
        const existingTemplate = yield Template_1.default.findOne({ name });
        if (existingTemplate) {
            return res.status(400).json({ message: "Template name already exists" });
        }
        if (!name || !type || !category || !content) {
            return res
                .status(400)
                .json({ message: "All required fields must be provided" });
        }
        const template = new Template_1.default({
            name,
            type,
            category,
            tags,
            layout,
            content,
            favorite: favorite || false,
            includeOptOutText: includeOptOutText || false, // ✅ default false
            userId: "67daedeaff85ef645f71206f",
            createdAt: new Date(),
            lastModified: new Date(),
        });
        yield template.save();
        res
            .status(201)
            .json({ message: "Template created successfully", template });
    }
    catch (error) {
        console.error("Error creating template:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.createTemplate = createTemplate;
// ✅ Fetch All Templates with Filters, Sorting & Pagination
const getAllTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, type, category, favorite, sortBy = "lastModified", // ✅ Default sorting by last modified date
        order = "desc", // ✅ Default order descending
        page = "1", limit = "10", } = req.query;
        let query = {};
        // ✅ Search by template name or tags
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { tags: { $in: [search] } },
            ];
        }
        // ✅ Filter by Type
        if (type) {
            query.type = type;
        }
        // ✅ Filter by Category
        if (category) {
            query.category = category;
        }
        // ✅ Filter by Favorite Status
        if (favorite) {
            query.favorite = favorite === "true";
        }
        // ✅ Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;
        // ✅ Sorting
        const sortField = sortBy;
        const sortOrder = order === "desc" ? -1 : 1;
        console.log("Final Query:", JSON.stringify(query, null, 2)); // ✅ Debug Query
        // ✅ Fetch Templates with Filters, Sorting & Pagination
        const templates = yield Template_1.default.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize);
        // ✅ Get Total Count for Pagination
        const totalCount = yield Template_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: templates,
            pagination: {
                total: totalCount,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        });
    }
    catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllTemplates = getAllTemplates;
// ✅ Get Templates by Category with Pagination
const getTemplatesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, favorite, sortBy = "lastModified", order = "desc", page = "1", limit = "10", search, } = req.query;
        const { category } = req.params;
        let query = {
            category, // ✅ From route param
            isDeleted: false,
        };
        // ✅ Search by name or tag
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { tags: { $in: [search] } },
            ];
        }
        if (type)
            query.type = type;
        if (favorite)
            query.favorite = favorite === "true";
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;
        const sortField = sortBy;
        const sortOrder = order === "desc" ? -1 : 1;
        const templates = yield Template_1.default.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize);
        const totalCount = yield Template_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: templates,
            pagination: {
                total: totalCount,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        });
    }
    catch (error) {
        console.error("Error fetching templates by category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTemplatesByCategory = getTemplatesByCategory;
//   Get a Single Template
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield Template_1.default.findById(req.params.id);
        if (!template)
            return res.status(404).json({ message: "Template not found" });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching template", error });
    }
});
exports.getTemplateById = getTemplateById;
//   Get Preview Template
const previewTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templateId = req.params.id;
        const template = yield Template_1.default.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json({
            id: template._id,
            name: template.name,
            content: template.content, // Assuming content stores HTML or JSON structure
            createdAt: template.createdAt,
        });
    }
    catch (error) {
        console.error("Error fetching template preview:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.previewTemplate = previewTemplate;
// Preview template before savings
const previewShowTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { htmlContent } = req.body;
        if (!htmlContent) {
            return res.status(400).json({ error: "HTML content is required for preview." });
        }
        // Send back the HTML content as response for preview
        res.status(200).json({ previewHtml: htmlContent });
    }
    catch (error) {
        console.error("Error previewing template:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.previewShowTemplate = previewShowTemplate;
// ✅ Update Template with Versioning & Modification Tracking
const updateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, subject, content, type, category, tags, layout, favorite, includeOptOutText } = req.body;
        // ✅ Find Existing Template
        const template = yield Template_1.default.findById(req.params.id);
        if (!template)
            return res.status(404).json({ message: "Template not found" });
        // ✅ Track Previous Version (for History & Rollback)
        const previousVersion = {
            name: template.name,
            subject: template.subject,
            content: template.content,
            type: template.type,
            category: template.category,
            tags: template.tags,
            layout: template.layout,
            favorite: template.favorite,
            lastModified: template.lastModified,
        };
        // ✅ Update Template Fields
        template.name = name || template.name;
        template.subject = subject || template.subject;
        template.content = content || template.content;
        template.type = type || template.type;
        template.category = category || template.category;
        template.tags = tags || template.tags;
        template.layout = layout || template.layout;
        template.favorite = favorite !== undefined ? favorite : template.favorite;
        // ✅ Optional Field: includeOptOutText
        if (includeOptOutText !== undefined) {
            template.includeOptOutText = includeOptOutText;
        }
        // ✅ Versioning: Increment If Any Changes
        if (JSON.stringify(previousVersion) !== JSON.stringify(template.toObject())) {
            template.version = (template.version || 1) + 1;
        }
        // ✅ Update Last Modified Timestamp
        template.lastModified = new Date();
        yield template.save();
        res.status(200).json({
            message: "Template updated successfully",
            template,
            previousVersion,
        });
    }
    catch (error) {
        console.error("Error updating template:", error);
        res.status(500).json({ message: "Error updating template", error });
    }
});
exports.updateTemplate = updateTemplate;
// ✅ Duplicate Template
const duplicateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get template ID from request params
        const originalTemplate = yield Template_1.default.findById(id);
        if (!originalTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        // ✅ Convert Mongoose Document to Plain Object
        const originalTemplateObject = originalTemplate.toObject();
        // ✅ Remove `_id` and create a new name
        delete originalTemplateObject._id;
        originalTemplateObject.name = `Copy of ${originalTemplateObject.name}`; // Append "Copy"
        originalTemplateObject.createdAt = new Date();
        originalTemplateObject.lastModified = new Date();
        originalTemplateObject.version = 1; // Reset version for the duplicate
        // ✅ Create a new template using the copied data
        const duplicatedTemplate = new Template_1.default(originalTemplateObject);
        yield duplicatedTemplate.save();
        res.status(201).json({
            message: "Template duplicated successfully",
            template: duplicatedTemplate,
        });
    }
    catch (error) {
        console.error("Error duplicating template:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.duplicateTemplate = duplicateTemplate;
// ✅ Soft Delete a Template (Mark as Deleted Instead of Removing)
const deleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield Template_1.default.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        // Mark template as deleted instead of permanently removing
        template.isDeleted = true;
        template.deletedAt = new Date();
        yield template.save();
        res.json({ message: "Template marked as deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting template:", error);
        res.status(500).json({ message: "Error deleting template", error });
    }
});
exports.deleteTemplate = deleteTemplate;
// Restore a soft-deleted template
const restoreTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restoredTemplate = yield Template_1.default.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        if (!restoredTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json(restoredTemplate);
    }
    catch (error) {
        console.error("Restore template failed:", error);
        res.status(500).json({ message: "Failed to restore template" });
    }
});
exports.restoreTemplateById = restoreTemplateById;
// ✅ Permanently Delete a Template
const permanentlyDeleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTemplate = yield Template_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTemplate)
            return res.status(404).json({ message: "Template not found" });
        res.json({ message: "Template permanently deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Error permanently deleting template", error });
    }
});
exports.permanentlyDeleteTemplate = permanentlyDeleteTemplate;
// ✅ Fetch Recently Used Templates
const getRecentlyUsedTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim();
        const type = req.query.type;
        const category = req.query.category;
        const sortBy = req.query.sortBy || "lastUsed";
        const order = req.query.order === "asc" ? 1 : -1;
        // Build query
        const query = {
            lastUsed: { $ne: null },
        };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }
        if (type) {
            query.type = type;
        }
        if (category) {
            query.category = category;
        }
        const total = yield Template_1.default.countDocuments(query);
        const templates = yield Template_1.default.find(query)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            templates,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        });
    }
    catch (error) {
        console.error("Error fetching recently used templates:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getRecentlyUsedTemplates = getRecentlyUsedTemplates;
//Fetch favorite templates
const getFavoriteTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc", type, category, } = req.query;
        const filters = { favorite: true };
        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }
        if (type)
            filters.type = type;
        if (category)
            filters.category = category;
        const skip = (+page - 1) * +limit;
        const total = yield Template_1.default.countDocuments(filters);
        const templates = yield Template_1.default.find(filters)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(+limit);
        return res.status(200).json({
            success: true,
            message: "Favorite templates fetched successfully",
            templates,
            pagination: {
                total,
                limit,
                page: +page,
                totalPages: Math.ceil(total / +limit),
            },
        });
    }
    catch (error) {
        console.error("Error fetching favorite templates:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getFavoriteTemplates = getFavoriteTemplates;
// ✅ Fetch Past Campaign Templates
const getPastCampaignTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield Template_1.default.find({ lastUsed: { $ne: null } })
            .sort({ lastUsed: -1 })
            .limit(10);
        res.status(200).json(templates);
    }
    catch (error) {
        console.error("Error fetching past campaign templates:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getPastCampaignTemplates = getPastCampaignTemplates;
// ✅ Toggle Favorite Template
const toggleFavoriteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        // ✅ Find the template first
        const template = yield Template_1.default.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        // ✅ Update only the `favorite` field without triggering validation
        const updatedTemplate = yield Template_1.default.findByIdAndUpdate(templateId, { $set: { favorite: !template.favorite } }, // ✅ Toggle favorite
        { new: true, runValidators: false } // ✅ Disable validation to prevent errors
        );
        res.status(200).json({
            message: `Template ${(updatedTemplate === null || updatedTemplate === void 0 ? void 0 : updatedTemplate.favorite) ? "marked" : "removed"} as favorite`,
            template: updatedTemplate,
        });
    }
    catch (error) {
        console.error("Error updating favorite status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.toggleFavoriteTemplate = toggleFavoriteTemplate;
