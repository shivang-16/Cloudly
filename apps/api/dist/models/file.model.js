"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FileSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Indexes for common queries
FileSchema.index({ ownerId: 1, folderId: 1, isTrashed: 1 });
FileSchema.index({ ownerId: 1, isStarred: 1 });
FileSchema.index({ "sharedWith.userId": 1 });
exports.File = mongoose_1.default.model("File", FileSchema);
//# sourceMappingURL=file.model.js.map