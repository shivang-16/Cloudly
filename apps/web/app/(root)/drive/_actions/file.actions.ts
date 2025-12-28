"use server";

import { apiGet, apiPatch, apiDelete } from "../../../../lib/api-client";
import { revalidatePath } from "next/cache";

export async function downloadFileAction(fileId: string) {
  try {
    const res = await apiGet(`/api/files/${fileId}/download`);
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to get download URL" };
    }
    
    return { success: true, downloadUrl: data.downloadUrl, fileName: data.fileName };
  } catch (error) {
    console.error("Error getting download URL:", error);
    return { success: false, error: "Failed to get download URL" };
  }
}

export async function renameFileAction(fileId: string, newName: string) {
  try {
    const res = await apiPatch(`/api/files/${fileId}/rename`, { name: newName });
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to rename file" };
    }
    
    revalidatePath("/drive");
    return { success: true, file: data.file };
  } catch (error) {
    console.error("Error renaming file:", error);
    return { success: false, error: "Failed to rename file" };
  }
}

export async function deleteFileAction(fileId: string, permanent: boolean = false) {
  try {
    const res = await apiDelete(`/api/files/${fileId}${permanent ? '?permanent=true' : ''}`);
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to delete file" };
    }
    
    revalidatePath("/drive");
    revalidatePath("/drive/bin");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}

export async function updateFileShareAction(fileId: string, isPublic: boolean) {
  try {
    const res = await apiPatch(`/api/files/${fileId}/share`, { isPublic });
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to update sharing" };
    }
    
    revalidatePath("/drive");
    return { success: true, file: data.file, publicUrl: data.publicUrl };
  } catch (error) {
    console.error("Error updating file sharing:", error);
    return { success: false, error: "Failed to update sharing" };
  }
}

export async function restoreFileAction(fileId: string) {
  try {
    const res = await apiPatch(`/api/files/${fileId}/restore`);
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to restore file" };
    }
    
    revalidatePath("/drive");
    revalidatePath("/drive/bin");
    return { success: true, file: data.file };
  } catch (error) {
    console.error("Error restoring file:", error);
    return { success: false, error: "Failed to restore file" };
  }
}

export async function getTrashedFilesAction() {
  try {
    const res = await apiGet('/api/files?trashed=true');
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to get trashed files", files: [] };
    }
    
    return { 
      success: true, 
      files: (data.files || []).map((f: any) => ({
        id: f._id,
        name: f.name,
        type: f.type || "file",
        mimeType: f.mimeType,
        size: f.size,
        owner: "me",
        updatedAt: f.updatedAt,
        trashedAt: f.trashedAt,
        isStarred: f.isStarred,
        isPublic: f.isPublic || false,
      }))
    };
  } catch (error) {
    console.error("Error getting trashed files:", error);
    return { success: false, error: "Failed to get trashed files", files: [] };
  }
}
