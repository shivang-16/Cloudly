"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const express_1 = require("@clerk/express");
const user_model_1 = require("../models/user.model");
const checkAuth = async (req, res, next) => {
    console.log("[Auth] Middleware execution started");
    try {
        const { userId } = (0, express_1.getAuth)(req);
        console.log("[Auth] Auth context extracted", { userId });
        if (!userId) {
            console.log("[Auth] No userId found in auth context");
            return res.status(401).json({ message: "Unauthorized" });
        }
        let user = await user_model_1.User.findById(userId);
        if (!user) {
            console.log(`[Auth] User not found in DB. Creating new user for: ${userId}`);
            let clerkUser;
            try {
                clerkUser = await express_1.clerkClient.users.getUser(userId);
            }
            catch (clerkError) {
                console.error(`[Auth] Failed to fetch user from Clerk: ${clerkError}`);
                if (clerkError?.status === 429) {
                    return res.status(429).json({
                        message: "Too many requests. Please try again.",
                        error: "Rate limit exceeded",
                    });
                }
                return res.status(500).json({ message: "Failed to authenticate user" });
            }
            const newUser = new user_model_1.User({
                _id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || "",
                firstName: clerkUser.firstName || clerkUser.username || "User",
                lastName: clerkUser.lastName || "",
                username: clerkUser.username || `user_${Date.now()}`,
                avatarUrl: clerkUser.imageUrl || "",
            });
            user = await newUser.save();
            console.log(`[Auth] New user created: ${user.username}`);
        }
        else {
            console.log(`[Auth] User found: ${user.username}`);
        }
        req.user = user;
        return next();
    }
    catch (err) {
        console.error(`[Auth] Authentication failed:`, err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=auth.middleware.js.map