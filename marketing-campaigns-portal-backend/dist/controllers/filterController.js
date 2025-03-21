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
exports.deleteFilter = exports.previewAudience = exports.getFilters = exports.duplicateFilter = exports.editFilter = exports.createOrUpdateFilter = void 0;
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
            userId: req.user.id,
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
        const filter = yield Filter_1.default.findOneAndUpdate({ _id: filterId, userId: req.user.id }, updatedData, { new: true });
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
        const filters = yield Filter_1.default.find({ /*userId: req.user.id*/ userId: req.user.id });
        res.status(200).json(filters);
    }
    catch (error) {
        console.error("Error fetching filters:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFilters = getFilters;
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
// ✅ Delete a Filter
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterId } = req.params;
        const filter = yield Filter_1.default.findOneAndDelete({ _id: filterId, /*userId: req.user.id*/ userId: req.user.id });
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
