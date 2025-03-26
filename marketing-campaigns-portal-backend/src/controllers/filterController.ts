/*import { Request, Response } from "express";
import Filter from "../models/Filter";*/
import User from "../models/User";

// Create a new filter
/*export const createFilter = async (req: Request, res: Response) => {
  try {
    const { name, conditions } = req.body;
    const filter = new Filter({ name, conditions, createdBy: (req as any).user.id });
    await filter.save();
    res.status(201).json(filter);
  } catch (error) {
    res.status(500).json({ message: "Error creating filter", error });
  }
};

// Apply filter to get matching users
export const applyFilter = async (req: Request, res: Response) => {
    try {
      const { filterId } = req.params;
      const filter = await Filter.findById(filterId);
      if (!filter) return res.status(404).json({ message: "Filter not found" });
  
      let query: any = {};
      let andConditions: any[] = [];
      let orConditions: any[] = [];
  
      filter.conditions.forEach((cond: any) => {
        if (cond.operator === "AND") {
          query["$and"] = andConditions;
        } else if (cond.operator === "OR") {
          query["$or"] = orConditions;
        } else {
          const condition = { [cond.field]: { [`$${cond.operator}`]: cond.value } };
          andConditions.push(condition);
          orConditions.push(condition);
        }
      });
  
      const users = await User.find(query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error applying filter", error });
    }
  };
// Get All Saved Filters
  export const getFilters = async (req: Request, res: Response) => {
    try {
      const filters = await Filter.find({ createdBy: (req as any).user.id });
      res.json(filters);
    } catch (error) {
      res.status(500).json({ message: "Error fetching filters", error });
    }
  };*/
  
  import { Request, Response } from "express";
  import Filter from "../models/Filter";

  export const createOrUpdateFilter = async (req: Request, res: Response) => {
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
  };
  
  // ✅ Edit an Existing Filter
  export const editFilter = async (req: Request, res: Response) => {
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
  };
  
  // ✅ Duplicate a Filter
  export const duplicateFilter = async (req: Request, res: Response) => {
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
  };
  
  // ✅ Get All Filters for a User
  export const getFilters = async (req: Request, res: Response) => {
    try {
      const filters = await Filter.find({ /*userId: req.user.id*/ /*userId: (req as any).user.id,*/ userId: "67daedeaff85ef645f71206f" });
      
      res.status(200).json(filters);
    } catch (error) {
      console.error("Error fetching filters:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

    // ✅ Get All Filters for a User
    export const getSingleFilter = async (req: Request, res: Response) => {
      try {
        const filterId = req.params.filterId;
        const filter = await Filter.findById(filterId);
    
        if (!filter) {
          return res.status(404).json({ message: "Filter not found" });
        }
    
        res.status(200).json({
          id: filter._id,
          name: filter.name,
          description: filter.description,
          tags: filter.tags,
          createdOn: filter.createdAt,
          audienceCount: filter.estimatedAudience,
        });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    };
  
  // ✅ Preview Estimated Audience Based on Conditions
  export const previewAudience = async (req: Request, res: Response) => {
    try {
      const { conditions } = req.body;
  
      if (!conditions || conditions.length === 0) {
        return res.status(400).json({ message: "Conditions are required for preview" });
      }
  
      // Dummy Audience Estimation Logic (Replace with real DB Query)
      const estimatedAudience = Math.floor(Math.random() * 10000);
  
      res.status(200).json({ estimatedAudience, message: "Audience preview generated successfully" });
    } catch (error) {
      console.error("Error generating audience preview:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Apply filter to get matching users
export const applyFilter = async (req: Request, res: Response) => {
  try {
    const { filterId } = req.params;
    const filter = await Filter.findById(filterId);
    if (!filter) return res.status(404).json({ message: "Filter not found" });

    let query: any = {};
    let andConditions: any[] = [];
    let orConditions: any[] = [];

    filter.conditions.forEach((cond: any) => {
      if (cond.operator === "AND") {
        query["$and"] = andConditions;
      } else if (cond.operator === "OR") {
        query["$or"] = orConditions;
      } else {
        const condition = { [cond.field]: { [`$${cond.operator}`]: cond.value } };
        andConditions.push(condition);
        orConditions.push(condition);
      }
    });

    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error applying filter", error });
  }
};
  
  // ✅ Delete a Filter
  export const deleteFilter = async (req: Request, res: Response) => {
    try {
      const { filterId } = req.params;
      const filter = await Filter.findOneAndDelete({ _id: filterId, /*userId: req.user.id*/ 
         /*userId: (req as any).user.id*/
         userId: "67daedeaff85ef645f71206f"
        });
  
      if (!filter) {
        return res.status(404).json({ message: "Filter not found" });
      }
  
      res.status(200).json({ message: "Filter deleted successfully" });
    } catch (error) {
      console.error("Error deleting filter:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
