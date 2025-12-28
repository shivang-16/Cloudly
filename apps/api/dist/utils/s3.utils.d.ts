interface SignedUrlParams {
    key: string;
    contentType?: string;
    expiresIn?: number;
}
/**
 * Generate a presigned URL for uploading a file to S3
 */
export declare const getPutObjectSignedUrl: (params: SignedUrlParams) => Promise<string>;
/**
 * Generate a presigned URL for downloading a file from S3
 */
export declare const getObjectSignedUrl: (params: SignedUrlParams) => Promise<string>;
/**
 * Delete an object from S3
 */
export declare const deleteObject: (key: string) => Promise<void>;
/**
 * Generate S3 key for a document
 */
export declare const generateS3Key: (userId: string, fileName: string, folderId?: string) => string;
/**
 * Get the public URL for an S3 object (if bucket is public)
 */
export declare const getPublicUrl: (key: string) => string;
/**
 * Determine document type from MIME type
 */
export declare const getDocumentType: (mimeType: string) => string;
export {};
