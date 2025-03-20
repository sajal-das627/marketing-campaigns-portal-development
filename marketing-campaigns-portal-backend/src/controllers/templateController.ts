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

import { Request, Response } from "express";
import Template from "../models/Template";

// ✅ Fetch All Templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const { search, type, category, favorite, sortBy, order, page = 1, limit = 10 } = req.query;

    let query: any = {};

    // ✅ Search by template name or tags
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { tags: { $in: [search as string] } },
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
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const templates = await Template.find(query)
      .sort({ [sortBy as string]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(pageSize);

    // ✅ Get Total Count for Pagination
    const totalCount = await Template.countDocuments(query);

    res.status(200).json({
      success: true,
      data: templates,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch Recently Used Templates
export const getRecentlyUsedTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({ lastUsed: { $ne: null } })
      .sort({ lastUsed: -1 })
      .limit(5);
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching recently used templates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch Past Campaign Templates
export const getPastCampaignTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({ lastUsed: { $ne: null } })
      .sort({ lastUsed: -1 })
      .limit(10);
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching past campaign templates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Toggle Favorite Template
export const toggleFavoriteTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;

    // ✅ Find the template first
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // ✅ Update only the `favorite` field without triggering validation
    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      { $set: { favorite: !template.favorite } }, // ✅ Toggle favorite
      { new: true, runValidators: false } // ✅ Disable validation to prevent errors
    );

    res.status(200).json({
      message: `Template ${updatedTemplate?.favorite ? "marked" : "removed"} as favorite`,
      template: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating favorite status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




  
  