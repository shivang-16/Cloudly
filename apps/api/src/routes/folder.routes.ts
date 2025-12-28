import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import {
  createFolder,
  getFolders,
  getFolder,
  renameFolder,
  deleteFolder,
  toggleFolderStar,
} from "../controllers/folder.controller";

const router: Router = Router();

// All routes require authentication
router.use(checkAuth);

// Folder CRUD
router.post("/", createFolder);
router.get("/", getFolders);
router.get("/:id", getFolder);
router.patch("/:id/rename", renameFolder);
router.patch("/:id/star", toggleFolderStar);
router.delete("/:id", deleteFolder);

export default router;
