import { Router } from "express";
import { educatorRouter } from "../modules/educator/routes";
import { studentRouter } from "../modules/student/routes";
import { taskRouter } from "../modules/task/routes";
import { taskNotebookSessionRouter } from "../modules/task-notebook-session/routes";

const router = Router();

router.use("/educator", educatorRouter);
router.use("/student", studentRouter);
router.use("/task", taskRouter);
router.use("/task-notebook-session", taskNotebookSessionRouter);

export { router };
