import { Request, Response } from "express";
/**
 * Create a new folder
 * POST /api/folders
 */
export declare const createFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user's folders
 * GET /api/folders
 */
export declare const getFolders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a single folder with its contents
 * GET /api/folders/:id
 */
export declare const getFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Rename a folder
 * PATCH /api/folders/:id/rename
 */
export declare const renameFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete a folder
 * DELETE /api/folders/:id
 */
export declare const deleteFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Star/Unstar a folder
 * PATCH /api/folders/:id/star
 */
export declare const toggleFolderStar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
