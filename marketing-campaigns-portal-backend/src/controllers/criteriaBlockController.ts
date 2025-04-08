import { Request, Response } from 'express';
import { CriteriaBlock } from '../models/criteriaBlock';

// ✅ Create Criteria Block
export const createCriteriaBlock = async (req: Request, res: Response) => {
  try {
    const { name, type, category } = req.body;

    if (!name || !type || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Check for duplicate name within the same category (case-insensitive)
    const existingBlock = await CriteriaBlock.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      category
    });

    if (existingBlock) {
      return res.status(409).json({
        success: false,
        message: 'A Criteria Block with the same name already exists in this category.'
      });
    }

    const newBlock = await CriteriaBlock.create({ name, type, category });

    return res.status(201).json({ success: true, message: 'Criteria Block created.', data: newBlock });
  } catch (error) {
    console.error('Error creating criteria block:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ✅ Get All Criteria Blocks (Optional filtering by category)
export const getCriteriaBlocks = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const filter: any = {};
    if (category) filter.category = category;

    const blocks = await CriteriaBlock.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: blocks });
  } catch (error) {
    console.error('Error fetching criteria blocks:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ✅ Delete Criteria Block
export const deleteCriteriaBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await CriteriaBlock.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Criteria Block deleted.' });
  } catch (error) {
    console.error('Error deleting criteria block:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



