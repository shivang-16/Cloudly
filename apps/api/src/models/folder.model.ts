import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFolder extends Document {
  name: string;
  ownerId: string;
  parentFolderId?: Types.ObjectId | null; // For nested folders
  isStarred: boolean;
  isTrashed: boolean;
  trashedAt?: Date;
  sharedWith: {
    userId: string;
    permission: "view" | "edit";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
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
FolderSchema.index({ ownerId: 1, parentFolderId: 1, isTrashed: 1 });
FolderSchema.index({ ownerId: 1, isStarred: 1 });
FolderSchema.index({ "sharedWith.userId": 1 });

export const Folder = mongoose.model<IFolder>("Folder", FolderSchema);
