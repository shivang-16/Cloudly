import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Omit<Document, "_id"> {
  _id: string; // Clerk User ID
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes (default 15GB for free tier)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    storageUsed: {
      type: Number,
      default: 0,
    },
    storageLimit: {
      type: Number,
      default: 15 * 1024 * 1024 * 1024, // 15GB in bytes
    },
  },
  {
    _id: false, // We use Clerk's userId as _id
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
