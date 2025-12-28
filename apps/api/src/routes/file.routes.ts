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
} from "../controllers/file.controller";

const router: Router = Router();

// All routes require authentication
router.use(checkAuth);

// Upload routes
router.post("/upload-url", getUploadUrl);
router.post("/confirm-upload", confirmUpload);

// File CRUD
router.get("/", getFiles);
router.get("/:id/download", getDownloadUrl);
router.patch("/:id/rename", renameFile);
router.patch("/:id/star", toggleFileStar);
router.delete("/:id", deleteFile);

export default router;
