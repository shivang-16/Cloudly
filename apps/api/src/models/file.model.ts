import mongoose, { Schema, Document, Types } from "mongoose";

export type FileType = 
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "txt"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "other";

export interface IFile extends Document {
  name: string;
  type: FileType;
  mimeType: string;
  size: number; // in bytes
  s3Key: string;
  s3Url: string;
  ownerId: string;
  folderId?: Types.ObjectId | null; // Which folder this file belongs to
  isStarred: boolean;
  isTrashed: boolean;
  isPublic: boolean; // Public sharing toggle
  trashedAt?: Date;
  sharedWith: {
    userId: string;
    permission: "view" | "edit";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "pdf", "doc", "docx", "xls", "xlsx",
        "ppt", "pptx", "txt", "image", "video", "audio", "archive", "other",
      ],
      default: "other",
    },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    ownerId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null },
    sharedWith: [
      {
        userId: { type: String, ref: "User" },
        permission: { type: String, enum: ["view", "edit"], default: "view" },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for common queries
FileSchema.index({ ownerId: 1, folderId: 1, isTrashed: 1 });
FileSchema.index({ ownerId: 1, isStarred: 1 });
FileSchema.index({ "sharedWith.userId": 1 });

export const File = mongoose.model<IFile>("File", FileSchema);
