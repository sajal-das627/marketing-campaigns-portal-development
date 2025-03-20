"use strict";
/*import { Request, Response } from "express";
import Template from "../models/Template";

// Create a new template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, content } = req.body;

    // Check if template name already exists
    const existingTemplate = await Template.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({ message: "Template name already exists" });
    }

    const template = new Template({
      name,
      subject,
      content,
      createdBy: (req as any).user.id
    });

    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error creating template", error });
  }
};
// Get All Templates
export const getTemplates = async (req: Request, res: Response) => {
    try {
      const templates = await Template.find({ createdBy: (req as any).user.id }).sort({ updatedAt: -1 });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching templates", error });
    }
  };

//   Get a Single Template
export const getTemplateById = async (req: Request, res: Response) => {
    try {
      const template = await Template.findById(req.params.id);
      if (!template) return res.status(404).json({ message: "Template not found" });
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error fetching template", error });
    }
  };

//   Update Template & Versioning
export const updateTemplate = async (req: Request, res: Response) => {
    try {
      const { subject, content } = req.body;
      const template = await Template.findById(req.params.id);
  
      if (!template) return res.status(404).json({ message: "Template not found" });
  
      template.subject = subject || template.subject;
      template.content = content || template.content;
      template.version += 1; // Increment version
      template.updatedAt = new Date();
  
      await template.save();
      res.json({ message: "Template updated successfully", template });
    } catch (error) {
      res.status(500).json({ message: "Error updating template", error });
    }
  };

//   Delete a Template

export const deleteTemplate = async (req: Request, res: Response) => {
    try {
      const template = await Template.findByIdAndDelete(req.params.id);
      if (!template) return res.status(404).json({ message: "Template not found" });
  
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting template", error });
    }
  };*/
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
exports.toggleFavoriteTemplate = exports.getPastCampaignTemplates = exports.getRecentlyUsedTemplates = exports.getAllTemplates = void 0;
const Template_1 = __importDefault(require("../models/Template"));
// ✅ Fetch All Templates
const getAllTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, type, category, favorite, sortBy, order, page = 1, limit = 10 } = req.query;
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
        // ✅ Pagination & Sorting
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;
        const templates = yield Template_1.default.find(query)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
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
            },
        });
    }
    catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllTemplates = getAllTemplates;
// ✅ Fetch Recently Used Templates
const getRecentlyUsedTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield Template_1.default.find({ lastUsed: { $ne: null } })
            .sort({ lastUsed: -1 })
            .limit(5);
        res.status(200).json(templates);
    }
    catch (error) {
        console.error("Error fetching recently used templates:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getRecentlyUsedTemplates = getRecentlyUsedTemplates;
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
