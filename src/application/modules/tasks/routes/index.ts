import { Request, Response, Router } from "express";
import { MockTaskRepository } from "../../../../infraestructure/repositories/mock/task-repository-impl";
import { CreateTaskUseCase } from "../use-cases/create-task/create-task-use-case";
import { CreateTaskController } from "../use-cases/create-task/create-task-controller";
import { ListTasksUseCase } from "../use-cases/list-tasks/list-tasks-use-case";
import { ListTasksController } from "../use-cases/list-tasks/list-tasks-controller";
import { MockEducatorRepository } from "../../../../infraestructure/repositories/mock/educator-repository-impl";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import { UpdateTaskUseCase } from "../use-cases/update-task/update-task-use-case";
import { UpdateTaskController } from "../use-cases/update-task/update-task-controller";
import { DeleteTaskUseCase } from "../use-cases/delete-task/delete-task-use-case";
import { DeleteTaskController } from "../use-cases/delete-task/delete-task-controller";

const tasksRouter = Router();

const taskRepository = new MockTaskRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);

const listTasksUseCase = new ListTasksUseCase(taskRepository);

const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

const educatorRepository = new MockEducatorRepository();

const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const authMiddleware = makeAuthMiddleware(educatorRepository);

tasksRouter.use(authMiddleware);

tasksRouter.post("/create", (req: Request, res: Response) => {
  new CreateTaskController(createTaskUseCase).execute(req, res);
});

tasksRouter.get("/", (req: Request, res: Response) => {
  new ListTasksController(listTasksUseCase).execute(req, res);
});

tasksRouter.put("/update", (req: Request, res: Response) => {
  new UpdateTaskController(updateTaskUseCase).execute(req, res);
});

tasksRouter.delete("/delete/:id", (req: Request, res: Response) => {
  new DeleteTaskController(deleteTaskUseCase).execute(req, res);
});

export { tasksRouter };
