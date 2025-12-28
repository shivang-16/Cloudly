import { Request, Response } from "express";
import { Folder, File } from "../models";
import { logger } from "../logger";

/**
 * Create a new folder
 * POST /api/folders
 */
export const createFolder = async (req: Request, res: Response) => {
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
      const parentFolder = await Folder.findOne({
        _id: parentFolderId,
        ownerId: user._id,
        isTrashed: false,
      });

      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = new Folder({
      name,
      ownerId: user._id,
      parentFolderId: parentFolderId || null,
    });

    await folder.save();

    res.status(201).json({
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.error("[Folders] Error creating folder:", error);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

/**
 * Get user's folders
 * GET /api/folders
 */
export const getFolders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { parentFolderId, starred, trashed, search, page = "1", limit = "20" } = req.query;
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query: any = { ownerId: user._id };

    // Search query - search in name
    if (search && typeof search === "string" && search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    } else {
      // Only apply folder filter if not searching
      if (parentFolderId) {
        query.parentFolderId = parentFolderId;
      } else if (!trashed && !starred) {
        query.parentFolderId = null; // Root level folders
      }
    }

    if (starred === "true") {
      query.isStarred = true;
    }

    if (trashed === "true") {
      query.isTrashed = true;
    } else {
      query.isTrashed = false;
    }

    const [folders, total] = await Promise.all([
      Folder.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limitNum),
      Folder.countDocuments(query),
    ]);

    res.json({ 
      folders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + folders.length < total,
      }
    });
  } catch (error) {
    console.error("[Folders] Error fetching folders:", error);
    res.status(500).json({ message: "Failed to fetch folders" });
  }
};

/**
 * Get a single folder with its contents
 * GET /api/folders/:id
 */
export const getFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const folder = await Folder.findOne({
      _id: id,
      $or: [
        { ownerId: user._id },
        { "sharedWith.userId": user._id },
      ],
    });


    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    logger.debug(folder)
    res.json({ folder });
  } catch (error) {
    console.error("[Folders] Error fetching folder:", error);
    res.status(500).json({ message: "Failed to fetch folder" });
  }
};

/**
 * Rename a folder
 * PATCH /api/folders/:id/rename
 */
export const renameFolder = async (req: Request, res: Response) => {
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

    const folder = await Folder.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder renamed", folder });
  } catch (error) {
    console.error("[Folders] Error renaming folder:", error);
    res.status(500).json({ message: "Failed to rename folder" });
  }
};

/**
 * Delete a folder
 * DELETE /api/folders/:id
 */
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const folder = await Folder.findOne({
      _id: id,
      ownerId: user._id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (permanent === "true") {
      // Check if folder has files or subfolders
      const filesCount = await File.countDocuments({ folderId: id, ownerId: user._id });
      const subfoldersCount = await Folder.countDocuments({ parentId: id, ownerId: user._id });
      
      if (filesCount > 0 || subfoldersCount > 0) {
        return res.status(400).json({ 
          message: "Folder is not empty. Please delete all files and subfolders first.",
          hasFiles: filesCount > 0,
          hasSubfolders: subfoldersCount > 0,
          filesCount,
          subfoldersCount,
        });
      }
      
      await folder.deleteOne();
      res.json({ message: "Folder permanently deleted" });
    } else {
      folder.isTrashed = true;
      folder.trashedAt = new Date();
      await folder.save();
      res.json({ message: "Folder moved to trash" });
    }
  } catch (error) {
    console.error("[Folders] Error deleting folder:", error);
    res.status(500).json({ message: "Failed to delete folder" });
  }
};

/**
 * Star/Unstar a folder
 * PATCH /api/folders/:id/star
 */
export const toggleFolderStar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const folder = await Folder.findOne({
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
  } catch (error) {
    console.error("[Folders] Error toggling star:", error);
    res.status(500).json({ message: "Failed to update folder" });
  }
};
