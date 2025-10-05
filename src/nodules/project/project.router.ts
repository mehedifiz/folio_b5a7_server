import Express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "./projects.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Express.Router();

router.post("/create", authMiddleware, createProject);
router.post("/delete/:id", authMiddleware, deleteProject);
router.put("/update/:id", authMiddleware, updateProject);
router.get("/getAll", getAllProjects);

export const projectRouter = router;
