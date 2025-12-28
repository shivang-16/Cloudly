import mongoose, { Document } from "mongoose";
export interface IUser extends Omit<Document, "_id"> {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string;
    storageUsed: number;
    storageLimit: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any, IUser>;
