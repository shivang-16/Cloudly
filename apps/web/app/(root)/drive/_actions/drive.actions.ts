"use server";

import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "../../../../lib/api-client";

export interface DriveItem {
  id: string;
  name: string;
  type: string;
  mimeType?: string;
  size?: number;
  owner: string;
  updatedAt: string;
  isStarred: boolean;
  isPublic?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DriveItemsResult {
  success: boolean;
  folders: DriveItem[];
  files: DriveItem[];
  foldersPagination?: PaginationInfo;
  filesPagination?: PaginationInfo;
  error?: string;
}

interface ApiFile {
  _id: string;
  name: string;
  type?: string;
  mimeType?: string;
  size?: number;
  updatedAt: string;
  isStarred?: boolean;
  isPublic?: boolean;
}

interface ApiFolder {
  _id: string;
  name: string;
  updatedAt: string;
  isStarred?: boolean;
}

export async function getDriveItemsAction(
  folderId?: string,
  options?: { page?: number; limit?: number; search?: string }
): Promise<DriveItemsResult> {
  try {
    const { page = 1, limit = 20, search } = options || {};
    let folders: DriveItem[] = [];
    let files: DriveItem[] = [];
    let foldersPagination: PaginationInfo | undefined;
    let filesPagination: PaginationInfo | undefined;

    const queryParams = new URLSearchParams();
    if (search) {
      queryParams.set('search', search);
    } else if (folderId) {
      queryParams.set('parentFolderId', folderId);
    }
    queryParams.set('page', page.toString());
    queryParams.set('limit', limit.toString());

    // Fetch folders
    try {
      const foldersRes = await apiGet(`/api/folders?${queryParams.toString()}`);
      const foldersData = await foldersRes.json();
      
      if (foldersData.folders && Array.isArray(foldersData.folders)) {
        folders = foldersData.folders.map((f: ApiFolder) => ({
          id: f._id,
          name: f.name,
          type: "folder",
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred || false,
          size: undefined,
        }));
        foldersPagination = foldersData.pagination;
      }
    } catch (folderError) {
      console.warn("Could not fetch folders:", folderError);
    }

    // Build files query params
    const fileQueryParams = new URLSearchParams();
    if (search) {
      fileQueryParams.set('search', search);
    } else if (folderId) {
      fileQueryParams.set('folderId', folderId);
    }
    fileQueryParams.set('page', page.toString());
    fileQueryParams.set('limit', limit.toString());

    // Fetch files
    try {
      const filesRes = await apiGet(`/api/files?${fileQueryParams.toString()}`);
      const filesData = await filesRes.json();
      
      if (filesData.files && Array.isArray(filesData.files)) {
        files = filesData.files.map((f: ApiFile) => ({
          id: f._id,
          name: f.name,
          type: f.type || "file",
          mimeType: f.mimeType,
          size: f.size,
          owner: "me",
          updatedAt: f.updatedAt,
          isStarred: f.isStarred || false,
          isPublic: f.isPublic || false,
        }));
        filesPagination = filesData.pagination;
      }
    } catch (fileError) {
      console.warn("Could not fetch files:", fileError);
    }

    return { success: true, folders, files, foldersPagination, filesPagination };
  } catch (error) {
    console.error("Error fetching drive items:", error);
    return { success: false, folders: [], files: [], error: "Failed to load drive items" };
  }
}

export async function searchDriveAction(query: string): Promise<DriveItemsResult> {
  if (!query.trim()) {
    return { success: true, folders: [], files: [] };
  }
  return getDriveItemsAction(undefined, { search: query, limit: 20 });
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
    return { success: true, folder: data.folder };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
