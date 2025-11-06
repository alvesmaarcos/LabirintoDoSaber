import { Request, Response, Router } from "express";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import { MockEducatorRepository } from "../../../../infraestructure/repositories/mock/educator-repository-impl";
import { MockTaskRepository } from "../../../../infraestructure/repositories/mock/task-repository-impl";
import { MockTaskNotebookRepository } from "../../../../infraestructure/repositories/mock/task-notebook-repository-impl";
import { CreateTaskNotebookUseCase } from "../use-cases/create-task-notebook/create-task-notebook-use-case";
import { CreateTaskNotebookController } from "../use-cases/create-task-notebook/create-task-notebook-controller";

const taskNotebookRouter = Router();

const educatorRepository = new MockEducatorRepository();
const taskRepository = new MockTaskRepository();
const taskNotebookRepository = new MockTaskNotebookRepository();

const createTaskNotebookUseCase = new CreateTaskNotebookUseCase(
  taskNotebookRepository,
  educatorRepository,
  taskRepository
);

const authMiddleware = makeAuthMiddleware(educatorRepository);

taskNotebookRouter.use(authMiddleware);

taskNotebookRouter.post("/create", async (req: Request, res: Response) => {
  new CreateTaskNotebookController(createTaskNotebookUseCase).execute(req, res);
});

export { taskNotebookRouter };
