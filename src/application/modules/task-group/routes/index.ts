import { Request, Response, Router } from "express";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import {
  makeEducatorRepository,
  makeTaskGroupRepository,
} from "../../../../infraestructure/factories";
import { CreateTaskGroupUseCase } from "../use-cases/create-task-group/create-task-group-use-case";
import { CreateTaskGroupController } from "../use-cases/create-task-group/create-task-group-controller";
import { ListByEducatorUseCase } from "../use-cases/list-by-educator/list-by-educator-use-case";
import { ListByEducatorController } from "../use-cases/list-by-educator/list-by-educator-controller";
import { DeleteTaskGroupUseCase } from "../use-cases/delete-task-group/delete-task-group-use-case";
import { DeleteTaskGroupController } from "../use-cases/delete-task-group/delete-task-group-controller";

const taskGroupRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const taskGroupRepository = makeTaskGroupRepository();

const createTaskGroupUseCase = new CreateTaskGroupUseCase(
  taskGroupRepository,
  educatorRepository
);

const listByEducatorUseCase = new ListByEducatorUseCase(taskGroupRepository);

const deleteTaskGroupUseCase = new DeleteTaskGroupUseCase(taskGroupRepository);

const authMiddleware = makeAuthMiddleware(educatorRepository);
taskGroupRouter.use(authMiddleware);

taskGroupRouter.post("/create", (req: Request, res: Response) => {
  new CreateTaskGroupController(createTaskGroupUseCase).execute(req, res);
});

taskGroupRouter.get("/list-by-educator", (req: Request, res: Response) => {
  new ListByEducatorController(listByEducatorUseCase).execute(req, res);
});

taskGroupRouter.delete("/delete/:taskGroupId", (req: Request, res: Response) => {
  new DeleteTaskGroupController(deleteTaskGroupUseCase).execute(req, res);
});


export { taskGroupRouter };
