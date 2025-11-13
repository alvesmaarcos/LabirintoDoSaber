import { Request, Response, Router } from "express";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import { CreateTaskNotebookUseCase } from "../use-cases/create-task-notebook/create-task-notebook-use-case";
import { CreateTaskNotebookController } from "../use-cases/create-task-notebook/create-task-notebook-controller";
import { ListTasksNotebooksUseCase } from "../use-cases/list-tasks-notebooks/list-tasks-notebooks-use-case";
import { ListTasksNotebooksController } from "../use-cases/list-tasks-notebooks/list-tasks-notebooks-controller";
import {
  makeEducatorRepository,
  makeTaskNotebookRepository,
  makeTaskRepository,
} from "../../../../infraestructure/factories";

const taskNotebookRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const taskRepository = makeTaskRepository({ isMock: false });
const taskNotebookRepository = makeTaskNotebookRepository({ isMock: false });

const createTaskNotebookUseCase = new CreateTaskNotebookUseCase(
  taskNotebookRepository,
  educatorRepository,
  taskRepository
);

const listTasksNotebooksUseCase = new ListTasksNotebooksUseCase(
  taskNotebookRepository
);

const authMiddleware = makeAuthMiddleware(educatorRepository);

taskNotebookRouter.use(authMiddleware);

taskNotebookRouter.post("/create", async (req: Request, res: Response) => {
  new CreateTaskNotebookController(createTaskNotebookUseCase).execute(req, res);
});

taskNotebookRouter.get("/", async (req: Request, res: Response) => {
  new ListTasksNotebooksController(listTasksNotebooksUseCase).execute(req, res);
});

export { taskNotebookRouter };
