import mongoose, { Document, Types } from "mongoose";
export interface IFolder extends Document {
    name: string;
    ownerId: string;
    parentFolderId?: Types.ObjectId | null;
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
export declare const Folder: mongoose.Model<IFolder, {}, {}, {}, mongoose.Document<unknown, {}, IFolder, {}, mongoose.DefaultSchemaOptions> & IFolder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IFolder>;
