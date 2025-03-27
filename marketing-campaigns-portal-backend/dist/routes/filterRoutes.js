"use strict";
/*import express from "express";
import { createFilter, getFilters, applyFilter } from "../controllers/filterController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createFilter);
router.get("/", authenticateToken, getFilters);
router.get("/apply/:filterId", authenticateToken, applyFilter);

export default router;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filterController_1 = require("../controllers/filterController");
const router = express_1.default.Router();
router.post("/", /*authenticateToken,*/ filterController_1.createOrUpdateFilter); // Create/Update Filter
router.put("/:filterId", /*authenticateToken,*/ filterController_1.editFilter); // Edit Filter
router.post("/:filterId/duplicate", /*authenticateToken,*/ filterController_1.duplicateFilter); // Duplicate Filter
router.get("/", /*authenticateToken,*/ filterController_1.getFilters); // Get All Filters
router.get("/:filterId", /*authenticateToken,*/ filterController_1.getSingleFilter); // Get Single Filters
router.get("/apply/:filterId", /*authenticateToken,*/ filterController_1.applyFilter);
router.post("/preview", /*authenticateToken,*/ filterController_1.previewAudience); // Get Estimated Audience
router.delete("/:filterId", /*authenticateToken,*/ filterController_1.deleteFilter); // Delete Filter
exports.default = router;
