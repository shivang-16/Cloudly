"use server";

import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "../../../../lib/api-client";

export interface DriveItem {
  id: string; // Mapped from _id
  name: string;
  type: string; // "folder" | "file"
  mimeType?: string;
  size?: number;
  owner: string; // Mapped from ownerId (or populated)
  updatedAt: string;
  isStarred: boolean;
  isPublic?: boolean;
}

export async function getDriveItemsAction(folderId?: string) {
  try {
    let folders: DriveItem[] = [];
    let files: DriveItem[] = [];

    // Fetch folders (optional)
    try {
      const foldersRes = await apiGet(`/api/folders${folderId ? `?parentFolderId=${folderId}` : ''}`);
      const foldersData = await foldersRes.json();
      
      if (foldersData.success && Array.isArray(foldersData.data)) {
        folders = foldersData.data.map((f: any) => ({
          id: f._id,
          name: f.name,
          type: "folder",
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred,
          size: undefined,
        }));
      } else if (foldersData.folders && Array.isArray(foldersData.folders)) {
        // Handle alternative API response format
        folders = foldersData.folders.map((f: any) => ({
          id: f._id,
          name: f.name,
          type: "folder",
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred,
          size: undefined,
        }));
      }
    } catch (folderError) {
      console.warn("Could not fetch folders:", folderError);
    }

    // Fetch files (optional)
    try {
      const filesRes = await apiGet(`/api/files${folderId ? `?folderId=${folderId}` : ''}`);
      const filesData = await filesRes.json();
      
      if (filesData.success && Array.isArray(filesData.data)) {
        files = filesData.data.map((f: any) => ({
          id: f._id,
          name: f.name,
          type: f.type || "file",
          mimeType: f.mimeType,
          size: f.size,
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred,
          isPublic: f.isPublic || false,
        }));
      } else if (filesData.files && Array.isArray(filesData.files)) {
        // Handle alternative API response format
        files = filesData.files.map((f: any) => ({
          id: f._id,
          name: f.name,
          type: f.type || "file",
          mimeType: f.mimeType,
          size: f.size,
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred,
          isPublic: f.isPublic || false,
        }));
      }
    } catch (fileError) {
      console.warn("Could not fetch files:", fileError);
    }

    return { success: true, folders, files };
  } catch (error) {
    console.error("Error fetching drive items:", error);
    return { success: false, folders: [], files: [], error: "Failed to load drive items" };
  }
}

export async function createFolderAction(name: string, parentId?: string) {
  try {
    const res = await apiPost("/api/folders", {
      name,
      parentFolderId: parentId || null,
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        return { success: false, error: data.message || "Failed to create folder" };
    }

    revalidatePath("/drive");
    // API returns { message: "...", folder: {...} }
    return { success: true, folder: data.folder };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
