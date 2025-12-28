"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const folder_controller_1 = require("../controllers/folder.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.checkAuth);
// Folder CRUD
router.post("/", folder_controller_1.createFolder);
router.get("/", folder_controller_1.getFolders);
router.get("/:id", folder_controller_1.getFolder);
router.patch("/:id/rename", folder_controller_1.renameFolder);
router.patch("/:id/star", folder_controller_1.toggleFolderStar);
router.delete("/:id", folder_controller_1.deleteFolder);
exports.default = router;
//# sourceMappingURL=folder.routes.js.map