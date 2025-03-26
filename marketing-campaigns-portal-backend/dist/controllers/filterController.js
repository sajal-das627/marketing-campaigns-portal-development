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
const createOrUpdateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, tags, conditions, logicalOperator, isDraft } = req.body;
        if (!name || !conditions || !logicalOperator) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Dummy Audience Estimation Logic (Replace with real logic)
        const estimatedAudience = Math.floor(Math.random() * 10000);
        const newFilter = new Filter_1.default({
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
const editFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const updatedData = req.body;
        const filter = yield Filter_1.default.findOneAndUpdate({ _id: filterId, // userId: (req as any).user.id,
            userId: "67daedeaff85ef645f71206f", }, updatedData, { new: true });
        if (!filter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        res.status(200).json({ message: "Filter Updated Successfully", filter });
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
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = yield Filter_1.default.find({ /*userId: req.user.id*/ /*userId: (req as any).user.id,*/ userId: "67daedeaff85ef645f71206f" });
        res.status(200).json(filters);
    }
    catch (error) {
        console.error("Error fetching filters:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFilters = getFilters;
// ✅ Get All Filters for a User
const getSingleFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterId = req.params.filterId;
        const filter = yield Filter_1.default.findById(filterId);
        if (!filter) {
            return res.status(404).json({ message: "Filter not found" });
        }
        res.status(200).json({
            id: filter._id,
            name: filter.name,
            description: filter.description,
            tags: filter.tags,
            lastUsed: filter.lastUsed,
            ctr: filter.ctr,
            createdOn: filter.createdAt,
            audienceCount: filter.estimatedAudience,
        });
    }
    catch (error) {
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
