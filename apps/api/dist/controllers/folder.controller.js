"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFolderStar = exports.deleteFolder = exports.renameFolder = exports.getFolder = exports.getFolders = exports.createFolder = void 0;
const models_1 = require("../models");
/**
 * Create a new folder
 * POST /api/folders
 */
const createFolder = async (req, res) => {
    try {
        const { name, parentFolderId } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!name) {
            return res.status(400).json({ message: "Folder name is required" });
        }
        // If parentFolderId is provided, verify it exists and belongs to user
        if (parentFolderId) {
            const parentFolder = await models_1.Folder.findOne({
                _id: parentFolderId,
                ownerId: user._id,
                isTrashed: false,
            });
            if (!parentFolder) {
                return res.status(404).json({ message: "Parent folder not found" });
            }
        }
        const folder = new models_1.Folder({
            name,
            ownerId: user._id,
            parentFolderId: parentFolderId || null,
        });
        await folder.save();
        res.status(201).json({
            message: "Folder created successfully",
            folder,
        });
    }
    catch (error) {
        console.error("[Folders] Error creating folder:", error);
        res.status(500).json({ message: "Failed to create folder" });
    }
};
exports.createFolder = createFolder;
/**
 * Get user's folders
 * GET /api/folders
 */
const getFolders = async (req, res) => {
    try {
        const user = req.user;
        const { parentFolderId, starred, trashed } = req.query;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const query = { ownerId: user._id };
        if (parentFolderId) {
            query.parentFolderId = parentFolderId;
        }
        else if (!trashed && !starred) {
            query.parentFolderId = null; // Root level folders
        }
        if (starred === "true") {
            query.isStarred = true;
        }
        if (trashed === "true") {
            query.isTrashed = true;
        }
        else {
            query.isTrashed = false;
        }
        const folders = await models_1.Folder.find(query).sort({ updatedAt: -1 });
        res.json({ folders });
    }
    catch (error) {
        console.error("[Folders] Error fetching folders:", error);
        res.status(500).json({ message: "Failed to fetch folders" });
    }
};
exports.getFolders = getFolders;
/**
 * Get a single folder with its contents
 * GET /api/folders/:id
 */
const getFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const folder = await models_1.Folder.findOne({
            _id: id,
            $or: [
                { ownerId: user._id },
                { "sharedWith.userId": user._id },
            ],
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.json({ folder });
    }
    catch (error) {
        console.error("[Folders] Error fetching folder:", error);
        res.status(500).json({ message: "Failed to fetch folder" });
    }
};
exports.getFolder = getFolder;
/**
 * Rename a folder
 * PATCH /api/folders/:id/rename
 */
const renameFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!name) {
            return res.status(400).json({ message: "New name is required" });
        }
        const folder = await models_1.Folder.findOneAndUpdate({ _id: id, ownerId: user._id }, { name }, { new: true });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.json({ message: "Folder renamed", folder });
    }
    catch (error) {
        console.error("[Folders] Error renaming folder:", error);
        res.status(500).json({ message: "Failed to rename folder" });
    }
};
exports.renameFolder = renameFolder;
/**
 * Delete a folder
 * DELETE /api/folders/:id
 */
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const folder = await models_1.Folder.findOne({
            _id: id,
            ownerId: user._id,
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        if (permanent === "true") {
            // TODO: Also delete all files and subfolders within this folder
            await folder.deleteOne();
            res.json({ message: "Folder permanently deleted" });
        }
        else {
            folder.isTrashed = true;
            folder.trashedAt = new Date();
            await folder.save();
            res.json({ message: "Folder moved to trash" });
        }
    }
    catch (error) {
        console.error("[Folders] Error deleting folder:", error);
        res.status(500).json({ message: "Failed to delete folder" });
    }
};
exports.deleteFolder = deleteFolder;
/**
 * Star/Unstar a folder
 * PATCH /api/folders/:id/star
 */
const toggleFolderStar = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const folder = await models_1.Folder.findOne({
            _id: id,
            ownerId: user._id,
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        folder.isStarred = !folder.isStarred;
        await folder.save();
        res.json({
            message: folder.isStarred ? "Folder starred" : "Folder unstarred",
            folder
        });
    }
    catch (error) {
        console.error("[Folders] Error toggling star:", error);
        res.status(500).json({ message: "Failed to update folder" });
    }
};
exports.toggleFolderStar = toggleFolderStar;
//# sourceMappingURL=folder.controller.js.map