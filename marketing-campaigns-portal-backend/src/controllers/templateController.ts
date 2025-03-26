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


// Create a new template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, type, category, tags, layout, content, favorite } = req.body;

    // Check if template name already exists
    const existingTemplate = await Template.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({ message: "Template name already exists" });
    }

    // Validate required fields
    if (!name || !type || !category || !layout || !content) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const template = new Template({
      name,
      type,
      category,
      tags,
      layout,
      content, // Includes global settings, images, buttons, etc.
      /*userId: (req as any).user.id,*/
      userId: "67daedeaff85ef645f71206f",
      favorite: favorite || false,
      createdAt: new Date(),
      lastModified: new Date(),
    });

    await template.save();
    res.status(201).json({ message: "Template created successfully", template });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// ✅ Fetch All Templates with Filters, Sorting & Pagination
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const {
      search,
      type,
      category,
      favorite,
      sortBy = "lastModified", // ✅ Default sorting by last modified date
      order = "desc", // ✅ Default order descending
      page = "1",
      limit = "10",
    } = req.query;

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

    // ✅ Pagination
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // ✅ Sorting
    const sortField = sortBy as string;
    const sortOrder = order === "desc" ? -1 : 1;

    console.log("Final Query:", JSON.stringify(query, null, 2)); // ✅ Debug Query

    // ✅ Fetch Templates with Filters, Sorting & Pagination
    const templates = await Template.find(query)
      .sort({ [sortField]: sortOrder })
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
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Update Template with Versioning & Modification Tracking
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, content, type, category, tags, layout, favorite } = req.body;

    // ✅ Find Existing Template
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });

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

    // ✅ Versioning: Increment If Any Changes
    if (JSON.stringify(previousVersion) !== JSON.stringify(template.toObject())) {
      template.version = (template.version || 1) + 1;
    }

    // ✅ Update Last Modified Timestamp
    template.lastModified = new Date();

    await template.save();

    res.status(200).json({
      message: "Template updated successfully",
      template,
      previousVersion, // Include previous version details
    });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Error updating template", error });
  }
};


// ✅ Duplicate Template
export const duplicateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get template ID from request params
    const originalTemplate = await Template.findById(id);

    if (!originalTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    // ✅ Convert Mongoose Document to Plain Object
    const originalTemplateObject = originalTemplate.toObject() as Record<string, any>;

    // ✅ Remove `_id` and create a new name
    delete originalTemplateObject._id;
    originalTemplateObject.name = `${originalTemplateObject.name} - Copy`; // Append "Copy"
    originalTemplateObject.createdAt = new Date();
    originalTemplateObject.lastModified = new Date();
    originalTemplateObject.version = 1; // Reset version for the duplicate

    // ✅ Create a new template using the copied data
    const duplicatedTemplate = new Template(originalTemplateObject);
    await duplicatedTemplate.save();

    res.status(201).json({
      message: "Template duplicated successfully",
      template: duplicatedTemplate,
    });

  } catch (error) {
    console.error("Error duplicating template:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Soft Delete a Template (Mark as Deleted Instead of Removing)
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Mark template as deleted instead of permanently removing
    template.isDeleted = true;
    template.deletedAt = new Date();
    await template.save();

    res.json({ message: "Template marked as deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Error deleting template", error });
  }
};

// ✅ Permanently Delete a Template
export const permanentlyDeleteTemplate = async (req: Request, res: Response) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete(req.params.id);
    if (!deletedTemplate) return res.status(404).json({ message: "Template not found" });

    res.json({ message: "Template permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error permanently deleting template", error });
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




  
  