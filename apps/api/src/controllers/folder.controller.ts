import { Request, Response } from "express";
import { Folder } from "../models";
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
    const { parentFolderId, starred, trashed } = req.query;
    console.log(user, "here isteh user")
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query: any = { ownerId: user._id };

    if (parentFolderId) {
      query.parentFolderId = parentFolderId;
    } else if (!trashed && !starred) {
      query.parentFolderId = null; // Root level folders
    }

    if (starred === "true") {
      query.isStarred = true;
    }

    if (trashed === "true") {
      query.isTrashed = true;
    } else {
      query.isTrashed = false;
    }

    const folders = await Folder.find(query).sort({ updatedAt: -1 });
    console.log(folders, "here isteh folders")
    res.json({ folders });
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
      // TODO: Also delete all files and subfolders within this folder
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
