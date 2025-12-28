"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const file_controller_1 = require("../controllers/file.controller");
const router = (0, express_1.Router)();
// Public routes (no auth)
router.get("/public/:id", file_controller_1.getPublicFile);
router.get("/public/:id/stream", file_controller_1.streamPublicFile);
// All routes below require authentication
router.use(auth_middleware_1.checkAuth);
// Upload routes
router.post("/upload-url", file_controller_1.getUploadUrl);
router.post("/confirm-upload", file_controller_1.confirmUpload);
// Storage
router.get("/storage", file_controller_1.getStorageInfo);
// File CRUD
router.get("/", file_controller_1.getFiles);
router.get("/:id/download", file_controller_1.getDownloadUrl);
router.get("/:id/stream", file_controller_1.streamFile);
router.patch("/:id/rename", file_controller_1.renameFile);
router.patch("/:id/star", file_controller_1.toggleFileStar);
router.patch("/:id/share", file_controller_1.toggleFileShare);
router.patch("/:id/restore", file_controller_1.restoreFile);
router.delete("/:id", file_controller_1.deleteFile);
exports.default = router;
//# sourceMappingURL=file.routes.js.map