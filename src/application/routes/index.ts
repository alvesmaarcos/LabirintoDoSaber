import { Router } from "express";
import { educatorRouter } from "../modules/educator/routes";
import { studentRouter } from "../modules/student/routes";
import { taskRouter } from "../modules/task/routes";

const router = Router();

router.use("/educator", educatorRouter);
router.use("/student", studentRouter);
router.use("/task", taskRouter);

export { router };
