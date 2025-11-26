import { Request, Response, Router } from "express";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import {
  makeEducatorRepository,
  makeTaskGroupRepository,
} from "../../../../infraestructure/factories";
import { CreateTaskGroupUseCase } from "../use-cases/create-task-group/create-task-group-use-case";
import { C } from "vitest/dist/chunks/reporters.d.BFLkQcL6";
import { CreateTaskGroupController } from "../use-cases/create-task-group/create-task-group-controller";

const taskGroupRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const taskGroupRepository = makeTaskGroupRepository();

const createTaskGroupUseCase = new CreateTaskGroupUseCase(
  taskGroupRepository,
  educatorRepository
);

const authMiddleware = makeAuthMiddleware(educatorRepository);
taskGroupRouter.use(authMiddleware);

taskGroupRouter.post("/create", (req: Request, res: Response) => {
  new CreateTaskGroupController(createTaskGroupUseCase).execute(req, res);
});

export { taskGroupRouter };
