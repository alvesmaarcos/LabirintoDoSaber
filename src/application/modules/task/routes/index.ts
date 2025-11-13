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

const taskRouter = Router();

const taskRepository = new MockTaskRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);

const listTasksUseCase = new ListTasksUseCase(taskRepository);

const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);

const educatorRepository = new MockEducatorRepository();

const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const authMiddleware = makeAuthMiddleware(educatorRepository);

taskRouter.use(authMiddleware);

taskRouter.post("/create", (req: Request, res: Response) => {
  new CreateTaskController(createTaskUseCase).execute(req, res);
});

taskRouter.get("/", (req: Request, res: Response) => {
  new ListTasksController(listTasksUseCase).execute(req, res);
});

taskRouter.put("/update", (req: Request, res: Response) => {
  new UpdateTaskController(updateTaskUseCase).execute(req, res);
});

taskRouter.delete("/delete/:id", (req: Request, res: Response) => {
  new DeleteTaskController(deleteTaskUseCase).execute(req, res);
});

export { taskRouter };
