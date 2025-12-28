import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import {
  getUploadUrl,
  confirmUpload,
  getFiles,
  getDownloadUrl,
  deleteFile,
  renameFile,
  toggleFileStar,
  toggleFileShare,
  getPublicFile,
  streamFile,
  streamPublicFile,
  restoreFile,
  getStorageInfo,
} from "../controllers/file.controller";

const router: Router = Router();

// Public routes (no auth)
router.get("/public/:id", getPublicFile);
router.get("/public/:id/stream", streamPublicFile);

// All routes below require authentication
router.use(checkAuth);

// Upload routes
router.post("/upload-url", getUploadUrl);
router.post("/confirm-upload", confirmUpload);

// Storage
router.get("/storage", getStorageInfo);

// File CRUD
router.get("/", getFiles);
router.get("/:id/download", getDownloadUrl);
router.get("/:id/stream", streamFile);
router.patch("/:id/rename", renameFile);
router.patch("/:id/star", toggleFileStar);
router.patch("/:id/share", toggleFileShare);
router.patch("/:id/restore", restoreFile);
router.delete("/:id", deleteFile);

export default router;

