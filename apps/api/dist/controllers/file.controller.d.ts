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
