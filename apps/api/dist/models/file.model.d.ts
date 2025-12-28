import mongoose, { Document, Types } from "mongoose";
export type FileType = "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "txt" | "image" | "video" | "audio" | "archive" | "other";
export interface IFile extends Document {
    name: string;
    type: FileType;
    mimeType: string;
    size: number;
    s3Key: string;
    s3Url: string;
    ownerId: string;
    folderId?: Types.ObjectId | null;
    isStarred: boolean;
    isTrashed: boolean;
    isPublic: boolean;
    trashedAt?: Date;
    sharedWith: {
        userId: string;
        permission: "view" | "edit";
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const File: mongoose.Model<IFile, {}, {}, {}, mongoose.Document<unknown, {}, IFile, {}, mongoose.DefaultSchemaOptions> & IFile & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IFile>;
