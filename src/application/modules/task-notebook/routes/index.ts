import { Request, Response, Router } from "express";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import { CreateTaskNotebookUseCase } from "../use-cases/create-task-notebook/create-task-notebook-use-case";
import { CreateTaskNotebookController } from "../use-cases/create-task-notebook/create-task-notebook-controller";
import { ListTasksNotebooksUseCase } from "../use-cases/list-tasks-notebooks/list-tasks-notebooks-use-case";
import { ListTasksNotebooksController } from "../use-cases/list-tasks-notebooks/list-tasks-notebooks-controller";
import { DeleteTaskNotebookUseCase } from "../use-cases/delete-task-notebook/delete-task-notebook-use-case";
import { DeleteTaskNotebookController } from "../use-cases/delete-task-notebook/delete-task-notebook-controller";
import {
  makeEducatorRepository,
  makeTaskGroupRepository,
  makeTaskNotebookRepository,
  makeTaskRepository,
} from "../../../../infraestructure/factories";

const taskNotebookRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const taskRepository = makeTaskRepository({ isMock: false });
const taskNotebookRepository = makeTaskNotebookRepository({ isMock: false });
const taskGroupRepository = makeTaskGroupRepository();

const createTaskNotebookUseCase = new CreateTaskNotebookUseCase(
  taskNotebookRepository,
  educatorRepository,
  taskRepository
);

const listTasksNotebooksUseCase = new ListTasksNotebooksUseCase(
  taskNotebookRepository,
  taskGroupRepository
);

const deleteTaskNotebookUseCase = new DeleteTaskNotebookUseCase(
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

taskNotebookRouter.delete("/delete/:taskNotebookId", async (req: Request, res: Response) => {
  new DeleteTaskNotebookController(deleteTaskNotebookUseCase).execute(req, res);
});

export { taskNotebookRouter };
