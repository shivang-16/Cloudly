import { Request, Response } from "express";
/**
 * Generate presigned URL for uploading a file
 * POST /api/files/upload-url
 */
export declare const getUploadUrl: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Confirm file upload and save to database
 * POST /api/files/confirm-upload
 */
export declare const confirmUpload: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user's files
 * GET /api/files
 */
export declare const getFiles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get download URL for a file
 * GET /api/files/:id/download
 * Owner gets 7-day URL, shared users get 5-minute URL
 */
export declare const getDownloadUrl: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete a file
 * DELETE /api/files/:id
 */
export declare const deleteFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Rename a file
 * PATCH /api/files/:id/rename
 */
export declare const renameFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Star/Unstar a file
 * PATCH /api/files/:id/star
 */
export declare const toggleFileStar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Toggle public/private sharing for a file
 * PATCH /api/files/:id/share
 */
export declare const toggleFileShare: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get public file (no auth required)
 * GET /api/files/public/:id
 * Public files get 7-day URLs
 */
export declare const getPublicFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Stream file through backend (authenticated)
 * GET /api/files/:id/stream
 * Proxies the file through the server - auth checked on every request
 */
export declare const streamFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Stream public file (no auth required)
 * GET /api/files/public/:id/stream
 * Proxies public files through the server
 */
export declare const streamPublicFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Restore a file from trash
 * PATCH /api/files/:id/restore
 */
export declare const restoreFile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user storage info
 * GET /api/files/storage
 */
export declare const getStorageInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
