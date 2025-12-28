"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentType = exports.getPublicUrl = exports.generateS3Key = exports.getObjectStream = exports.deleteObject = exports.getObjectSignedUrl = exports.getPutObjectSignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3_1 = __importDefault(require("../aws/s3"));
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "cloudly-docs";
/**
 * Generate a presigned URL for uploading a file to S3
 */
const getPutObjectSignedUrl = async (params) => {
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: params.key,
            ContentType: params.contentType || "application/octet-stream",
        });
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3_1.default, command, {
            expiresIn: params.expiresIn || 3600 // 1 hour default
        });
        return signedUrl;
    }
    catch (error) {
        console.error("[S3] Error generating PUT signed URL:", error);
        throw error;
    }
};
exports.getPutObjectSignedUrl = getPutObjectSignedUrl;
/**
 * Generate a presigned URL for downloading a file from S3
 * URLs expire in 5 minutes for security - requires re-authentication to get new URL
 */
const getObjectSignedUrl = async (params) => {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: params.key,
        });
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3_1.default, command, {
            expiresIn: params.expiresIn || 300 // 5 minutes default for security
        });
        return signedUrl;
    }
    catch (error) {
        console.error("[S3] Error generating GET signed URL:", error);
        throw error;
    }
};
exports.getObjectSignedUrl = getObjectSignedUrl;
/**
 * Delete an object from S3
 */
const deleteObject = async (key) => {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        await s3_1.default.send(command);
        console.log(`[S3] Deleted object: ${key}`);
    }
    catch (error) {
        console.error("[S3] Error deleting object:", error);
        throw error;
    }
};
exports.deleteObject = deleteObject;
/**
 * Get object stream from S3 for proxying files
 * Returns the stream and metadata
 */
const getObjectStream = async (key) => {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await s3_1.default.send(command);
        return {
            stream: response.Body,
            contentType: response.ContentType || "application/octet-stream",
            contentLength: response.ContentLength,
        };
    }
    catch (error) {
        console.error("[S3] Error getting object stream:", error);
        throw error;
    }
};
exports.getObjectStream = getObjectStream;
/**
 * Generate S3 key for a document
 */
const generateS3Key = (userId, fileName, folderId) => {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const folderPath = folderId ? `${folderId}/` : "";
    return `users/${userId}/${folderPath}${timestamp}-${sanitizedFileName}`;
};
exports.generateS3Key = generateS3Key;
/**
 * Get the public URL for an S3 object (if bucket is public)
 */
const getPublicUrl = (key) => {
    const region = process.env.AWS_REGION || "ap-south-1";
    return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
};
exports.getPublicUrl = getPublicUrl;
/**
 * Determine document type from MIME type
 */
const getDocumentType = (mimeType) => {
    const mimeMap = {
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "text/plain": "txt",
    };
    if (mimeType.startsWith("image/"))
        return "image";
    if (mimeType.startsWith("video/"))
        return "video";
    if (mimeType.startsWith("audio/"))
        return "audio";
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar"))
        return "archive";
    return mimeMap[mimeType] || "other";
};
exports.getDocumentType = getDocumentType;
//# sourceMappingURL=s3.utils.js.map