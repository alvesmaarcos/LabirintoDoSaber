import { Request, Response, Router } from "express";
import { MockTaskRepository } from "../../../../infraestructure/repositories/mock/task-repository-impl";
import { CreateTaskUseCase} from "../use-cases/create-task/create-task-use-case";
import { CreateTaskController } from "../use-cases/create-task/create-task-controller";
import { ListTasksUseCase } from "../use-cases/lista-tasks/list-tasks-use-case";
import { ListTasksController } from "../use-cases/lista-tasks/list-tasks-controller";

const tasksRouter = Router();

const taskRepository = new MockTaskRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);

const listTasksUseCase = new ListTasksUseCase(taskRepository);

tasksRouter.post("/create", (req: Request, res: Response) => {
    new CreateTaskController(createTaskUseCase).execute(req, res);
});

tasksRouter.get("/", (req: Request, res: Response) => {
    new ListTasksController(listTasksUseCase).execute(req, res);
});

export { tasksRouter };