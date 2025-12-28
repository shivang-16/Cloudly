"use server";

import { apiGet } from "../../../../lib/api-client";

export async function getStarredFilesAction() {
  try {
    const res = await apiGet('/api/files?starred=true');
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, error: data.message || "Failed to get starred files", files: [] };
    }
    
    return { 
      success: true, 
      files: (data.files || []).map((f: { _id: string; name: string; type?: string; mimeType?: string; size: number; updatedAt: string; isStarred?: boolean; isPublic?: boolean }) => ({
        id: f._id,
        name: f.name,
        type: f.type || "file",
        mimeType: f.mimeType,
        size: f.size,
        owner: "me",
        updatedAt: f.updatedAt,
        isStarred: f.isStarred || false,
        isPublic: f.isPublic || false,
      }))
    };
  } catch (error) {
    console.error("Error getting starred files:", error);
    return { success: false, error: "Failed to get starred files", files: [] };
  }
}

export async function getStorageInfoAction() {
  try {
    const res = await apiGet('/api/files');
    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, storageUsed: 0 };
    }
    
    // Calculate total storage used from all files (including trash is handled by backend)
    const files = data.files || [];
    const totalBytes = files.reduce((acc: number, f: { size: number }) => acc + (f.size || 0), 0);
    
    return { success: true, storageUsed: totalBytes };
  } catch (error) {
    console.error("Error getting storage info:", error);
    return { success: false, storageUsed: 0 };
  }
}
