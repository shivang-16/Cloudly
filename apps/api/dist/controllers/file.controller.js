"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageInfo = exports.restoreFile = exports.streamPublicFile = exports.streamFile = exports.getPublicFile = exports.toggleFileShare = exports.toggleFileStar = exports.renameFile = exports.deleteFile = exports.getDownloadUrl = exports.getFiles = exports.confirmUpload = exports.getUploadUrl = void 0;
const models_1 = require("../models");
const s3_utils_1 = require("../utils/s3.utils");
/**
 * Generate presigned URL for uploading a file
 * POST /api/files/upload-url
 */
const getUploadUrl = async (req, res) => {
    try {
        const { fileName, fileType, fileSize, folderId } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!fileName || !fileType) {
            return res.status(400).json({ message: "fileName and fileType are required" });
        }
        // Check storage limit
        const newStorageUsed = user.storageUsed + (fileSize || 0);
        if (newStorageUsed > user.storageLimit) {
            return res.status(400).json({
                message: "Storage limit exceeded",
                storageUsed: user.storageUsed,
                storageLimit: user.storageLimit,
            });
        }
        // If folderId is provided, verify it exists
        if (folderId) {
            const folder = await models_1.Folder.findOne({
                _id: folderId,
                ownerId: user._id,
                isTrashed: false,
            });
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
        }
        // Generate S3 key
        const s3Key = (0, s3_utils_1.generateS3Key)(user._id, fileName, folderId);
        // Get presigned URL for upload
        const uploadUrl = await (0, s3_utils_1.getPutObjectSignedUrl)({
            key: s3Key,
            contentType: fileType,
        });
        res.json({
            uploadUrl,
            s3Key,
            publicUrl: (0, s3_utils_1.getPublicUrl)(s3Key),
            fileType: (0, s3_utils_1.getDocumentType)(fileType),
        });
    }
    catch (error) {
        console.error("[Files] Error generating upload URL:", error);
        res.status(500).json({ message: "Failed to generate upload URL" });
    }
};
exports.getUploadUrl = getUploadUrl;
/**
 * Confirm file upload and save to database
 * POST /api/files/confirm-upload
 */
const confirmUpload = async (req, res) => {
    try {
        const { name, s3Key, s3Url, mimeType, size, folderId } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!name || !s3Key || !s3Url) {
            return res.status(400).json({ message: "name, s3Key, and s3Url are required" });
        }
        // Create file in database
        const file = new models_1.File({
            name,
            type: (0, s3_utils_1.getDocumentType)(mimeType || ""),
            mimeType: mimeType || "",
            size: size || 0,
            s3Key,
            s3Url,
            ownerId: user._id,
            folderId: folderId || null,
        });
        await file.save();
        // Update user's storage used
        user.storageUsed += size || 0;
        await user.save();
        res.status(201).json({
            message: "File uploaded successfully",
            file,
        });
    }
    catch (error) {
        console.error("[Files] Error confirming upload:", error);
        res.status(500).json({ message: "Failed to save file" });
    }
};
exports.confirmUpload = confirmUpload;
/**
 * Get user's files
 * GET /api/files
 */
const getFiles = async (req, res) => {
    try {
        const user = req.user;
        const { folderId, starred, trashed, search, page = "1", limit = "20" } = req.query;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * limitNum;
        const query = { ownerId: user._id };
        // Search query - search in name
        if (search && typeof search === "string" && search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" };
        }
        else {
            // Only apply folder filter if not searching
            if (folderId) {
                query.folderId = folderId;
            }
            else if (!trashed && !starred) {
                query.folderId = null; // Root level files
            }
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
        const [files, total] = await Promise.all([
            models_1.File.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNum),
            models_1.File.countDocuments(query),
        ]);
        res.json({
            files,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
                hasMore: skip + files.length < total,
            }
        });
    }
    catch (error) {
        console.error("[Files] Error fetching files:", error);
        res.status(500).json({ message: "Failed to fetch files" });
    }
};
exports.getFiles = getFiles;
/**
 * Get download URL for a file
 * GET /api/files/:id/download
 * Owner gets 7-day URL, shared users get 5-minute URL
 */
const getDownloadUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            $or: [
                { ownerId: user._id },
                { "sharedWith.userId": user._id },
            ],
        });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        // Determine URL expiry based on ownership
        // Owner or public file = 7 days (604800 seconds - max allowed by S3)
        // Shared with user = 5 minutes
        const isOwner = file.ownerId === user._id;
        const expiresIn = isOwner || file.isPublic ? 604800 : 300;
        const downloadUrl = await (0, s3_utils_1.getObjectSignedUrl)({ key: file.s3Key, expiresIn });
        res.json({ downloadUrl, fileName: file.name });
    }
    catch (error) {
        console.error("[Files] Error getting download URL:", error);
        res.status(500).json({ message: "Failed to get download URL" });
    }
};
exports.getDownloadUrl = getDownloadUrl;
/**
 * Delete a file
 * DELETE /api/files/:id
 */
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            ownerId: user._id,
        });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (permanent === "true") {
            // Delete from S3
            if (file.s3Key) {
                await (0, s3_utils_1.deleteObject)(file.s3Key);
            }
            await file.deleteOne();
            // Update storage used
            user.storageUsed = Math.max(0, user.storageUsed - file.size);
            await user.save();
            res.json({ message: "File permanently deleted" });
        }
        else {
            file.isTrashed = true;
            file.trashedAt = new Date();
            await file.save();
            res.json({ message: "File moved to trash" });
        }
    }
    catch (error) {
        console.error("[Files] Error deleting file:", error);
        res.status(500).json({ message: "Failed to delete file" });
    }
};
exports.deleteFile = deleteFile;
/**
 * Rename a file
 * PATCH /api/files/:id/rename
 */
const renameFile = async (req, res) => {
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
        const file = await models_1.File.findOneAndUpdate({ _id: id, ownerId: user._id }, { name }, { new: true });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        res.json({ message: "File renamed", file });
    }
    catch (error) {
        console.error("[Files] Error renaming file:", error);
        res.status(500).json({ message: "Failed to rename file" });
    }
};
exports.renameFile = renameFile;
/**
 * Star/Unstar a file
 * PATCH /api/files/:id/star
 */
const toggleFileStar = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            ownerId: user._id,
        });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        file.isStarred = !file.isStarred;
        await file.save();
        res.json({
            message: file.isStarred ? "File starred" : "File unstarred",
            file
        });
    }
    catch (error) {
        console.error("[Files] Error toggling star:", error);
        res.status(500).json({ message: "Failed to update file" });
    }
};
exports.toggleFileStar = toggleFileStar;
/**
 * Toggle public/private sharing for a file
 * PATCH /api/files/:id/share
 */
const toggleFileShare = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublic } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (typeof isPublic !== "boolean") {
            return res.status(400).json({ message: "isPublic must be a boolean" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            ownerId: user._id,
        });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        file.isPublic = isPublic;
        await file.save();
        res.json({
            message: isPublic ? "File is now public" : "File is now private",
            file,
            publicUrl: isPublic ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/public/file/${file._id}` : null,
        });
    }
    catch (error) {
        console.error("[Files] Error toggling share:", error);
        res.status(500).json({ message: "Failed to update file sharing" });
    }
};
exports.toggleFileShare = toggleFileShare;
/**
 * Get public file (no auth required)
 * GET /api/files/public/:id
 * Public files get 7-day URLs
 */
const getPublicFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await models_1.File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (!file.isPublic) {
            return res.status(403).json({ message: "This file is not publicly accessible" });
        }
        // Public files get 7-day presigned URL (max allowed by S3)
        const downloadUrl = await (0, s3_utils_1.getObjectSignedUrl)({ key: file.s3Key, expiresIn: 604800 });
        res.json({
            file: {
                _id: file._id,
                name: file.name,
                type: file.type,
                mimeType: file.mimeType,
                size: file.size,
            },
            downloadUrl,
        });
    }
    catch (error) {
        console.error("[Files] Error getting public file:", error);
        res.status(500).json({ message: "Failed to get file" });
    }
};
exports.getPublicFile = getPublicFile;
/**
 * Stream file through backend (authenticated)
 * GET /api/files/:id/stream
 * Proxies the file through the server - auth checked on every request
 */
const streamFile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        console.log(user, "here is teh user");
        if (!user) {
            console.log(" user is not found");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            $or: [
                { ownerId: user._id },
                { "sharedWith.userId": user._id },
            ],
        });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        // For private files, only owner can access
        if (!file.isPublic && file.ownerId !== user._id) {
            // Check if user is in sharedWith
            const isShared = file.sharedWith.some(s => s.userId === user._id);
            if (!isShared) {
                return res.status(403).json({ message: "Access denied" });
            }
        }
        // Get stream from S3
        const { stream, contentType, contentLength } = await (0, s3_utils_1.getObjectStream)(file.s3Key);
        if (!stream) {
            return res.status(500).json({ message: "Failed to get file stream" });
        }
        // Set response headers
        res.setHeader("Content-Type", contentType);
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
        res.setHeader("Cache-Control", "private, max-age=3600");
        // Pipe the stream to response
        // @ts-ignore - Body is a readable stream
        stream.pipe(res);
    }
    catch (error) {
        console.error("[Files] Error streaming file:", error);
        res.status(500).json({ message: "Failed to stream file" });
    }
};
exports.streamFile = streamFile;
/**
 * Stream public file (no auth required)
 * GET /api/files/public/:id/stream
 * Proxies public files through the server
 */
const streamPublicFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await models_1.File.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        if (!file.isPublic) {
            return res.status(403).json({ message: "This file is not publicly accessible" });
        }
        // Get stream from S3
        const { stream, contentType, contentLength } = await (0, s3_utils_1.getObjectStream)(file.s3Key);
        if (!stream) {
            return res.status(500).json({ message: "Failed to get file stream" });
        }
        // Set response headers
        res.setHeader("Content-Type", contentType);
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
        res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day cache for public files
        // Pipe the stream to response
        // @ts-ignore - Body is a readable stream
        stream.pipe(res);
    }
    catch (error) {
        console.error("[Files] Error streaming public file:", error);
        res.status(500).json({ message: "Failed to stream file" });
    }
};
exports.streamPublicFile = streamPublicFile;
/**
 * Restore a file from trash
 * PATCH /api/files/:id/restore
 */
const restoreFile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = await models_1.File.findOne({
            _id: id,
            ownerId: user._id,
            isTrashed: true,
        });
        if (!file) {
            return res.status(404).json({ message: "File not found in trash" });
        }
        file.isTrashed = false;
        file.trashedAt = undefined;
        await file.save();
        res.json({ message: "File restored", file });
    }
    catch (error) {
        console.error("[Files] Error restoring file:", error);
        res.status(500).json({ message: "Failed to restore file" });
    }
};
exports.restoreFile = restoreFile;
/**
 * Get user storage info
 * GET /api/files/storage
 */
const getStorageInfo = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.json({
            storageUsed: user.storageUsed || 0,
            storageLimit: user.storageLimit || 20 * 1024 * 1024 * 1024, // Default 20GB
        });
    }
    catch (error) {
        console.error("[Files] Error getting storage info:", error);
        res.status(500).json({ message: "Failed to get storage info" });
    }
};
exports.getStorageInfo = getStorageInfo;
//# sourceMappingURL=file.controller.js.map