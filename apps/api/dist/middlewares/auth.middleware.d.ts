import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare const checkAuth: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
