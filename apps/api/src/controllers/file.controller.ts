import { Request, Response } from "express";
import { File, Folder } from "../models";
import { 
  getPutObjectSignedUrl, 
  getObjectSignedUrl, 
  generateS3Key, 
  getPublicUrl,
  getDocumentType,
  deleteObject 
} from "../utils/s3.utils";

/**
 * Generate presigned URL for uploading a file
 * POST /api/files/upload-url
 */
export const getUploadUrl = async (req: Request, res: Response) => {
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
      const folder = await Folder.findOne({
        _id: folderId,
        ownerId: user._id,
        isTrashed: false,
      });

      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
    }

    // Generate S3 key
    const s3Key = generateS3Key(user._id, fileName, folderId);

    // Get presigned URL for upload
    const uploadUrl = await getPutObjectSignedUrl({
      key: s3Key,
      contentType: fileType,
    });

    res.json({
      uploadUrl,
      s3Key,
      publicUrl: getPublicUrl(s3Key),
      fileType: getDocumentType(fileType),
    });
  } catch (error) {
    console.error("[Files] Error generating upload URL:", error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

/**
 * Confirm file upload and save to database
 * POST /api/files/confirm-upload
 */
export const confirmUpload = async (req: Request, res: Response) => {
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
    const file = new File({
      name,
      type: getDocumentType(mimeType || ""),
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
  } catch (error) {
    console.error("[Files] Error confirming upload:", error);
    res.status(500).json({ message: "Failed to save file" });
  }
};

/**
 * Get user's files
 * GET /api/files
 */
export const getFiles = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { folderId, starred, trashed } = req.query;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query: any = { ownerId: user._id };

    if (folderId) {
      query.folderId = folderId;
    } else if (!trashed && !starred) {
      query.folderId = null; // Root level files
    }

    if (starred === "true") {
      query.isStarred = true;
    }

    if (trashed === "true") {
      query.isTrashed = true;
    } else {
      query.isTrashed = false;
    }

    const files = await File.find(query).sort({ updatedAt: -1 });

    res.json({ files });
  } catch (error) {
    console.error("[Files] Error fetching files:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

/**
 * Get download URL for a file
 * GET /api/files/:id/download
 */
export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = await File.findOne({
      _id: id,
      $or: [
        { ownerId: user._id },
        { "sharedWith.userId": user._id },
      ],
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const downloadUrl = await getObjectSignedUrl({ key: file.s3Key });

    res.json({ downloadUrl, fileName: file.name });
  } catch (error) {
    console.error("[Files] Error getting download URL:", error);
    res.status(500).json({ message: "Failed to get download URL" });
  }
};

/**
 * Delete a file
 * DELETE /api/files/:id
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = await File.findOne({
      _id: id,
      ownerId: user._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (permanent === "true") {
      // Delete from S3
      if (file.s3Key) {
        await deleteObject(file.s3Key);
      }
      await file.deleteOne();

      // Update storage used
      user.storageUsed = Math.max(0, user.storageUsed - file.size);
      await user.save();

      res.json({ message: "File permanently deleted" });
    } else {
      file.isTrashed = true;
      file.trashedAt = new Date();
      await file.save();
      res.json({ message: "File moved to trash" });
    }
  } catch (error) {
    console.error("[Files] Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

/**
 * Rename a file
 * PATCH /api/files/:id/rename
 */
export const renameFile = async (req: Request, res: Response) => {
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

    const file = await File.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      { name },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File renamed", file });
  } catch (error) {
    console.error("[Files] Error renaming file:", error);
    res.status(500).json({ message: "Failed to rename file" });
  }
};

/**
 * Star/Unstar a file
 * PATCH /api/files/:id/star
 */
export const toggleFileStar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = await File.findOne({
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
  } catch (error) {
    console.error("[Files] Error toggling star:", error);
    res.status(500).json({ message: "Failed to update file" });
  }
};
