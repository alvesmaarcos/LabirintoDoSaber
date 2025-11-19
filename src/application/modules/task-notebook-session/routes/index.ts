import { Request, Response, Router } from "express";
import {
  makeEducatorRepository,
  makeStudentRepository,
  makeTaskNotebookRepository,
  makeTaskNotebookSessionRepository,
  makeTaskRepository,
} from "../../../../infraestructure/factories";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import { StartTaskNotebookSessionUseCase } from "../use-cases/start-task-notebook-session/start-task-session-use-case";
import { AnswerTaskNotebookSessionUseCase } from "../use-cases/answer-task-notebook-session/answer-task-notebook-session-use-case";
import { FinishTaskNotebookSessionUseCase } from "../use-cases/finish-task-notebook-session/finish-task-notebook-session-use-case";
import { StartTaskNotebookSessionController } from "../use-cases/start-task-notebook-session/start-task-session-controller";
import { AnswerTaskNotebookSessionController } from "../use-cases/answer-task-notebook-session/answer-task-notebook-session-controller";
import { FinishTaskNotebookController } from "../use-cases/finish-task-notebook-session/finish-task-notebook-session-controller";

const taskNotebookSessionRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const studentRepository = makeStudentRepository({ isMock: false });
const taskNotebookRepository = makeTaskNotebookRepository({ isMock: false });
const taskSessionRepository = makeTaskNotebookSessionRepository();
const taskRepository = makeTaskRepository({ isMock: false });
const authMiddleware = makeAuthMiddleware(educatorRepository);

const startTaskNotebookSessionUseCase = new StartTaskNotebookSessionUseCase(
  taskNotebookRepository,
  taskSessionRepository,
  studentRepository
);

const answerTaskNotebookSessionUseCase = new AnswerTaskNotebookSessionUseCase(
  taskSessionRepository,
  taskRepository,
  taskNotebookRepository
);

const finishTaskNotebookSessionUseCase = new FinishTaskNotebookSessionUseCase(
  taskSessionRepository
);

taskNotebookSessionRouter.use(authMiddleware);

taskNotebookSessionRouter.post("/start", (req: Request, res: Response) => {
  new StartTaskNotebookSessionController(
    startTaskNotebookSessionUseCase
  ).execute(req, res);
});

taskNotebookSessionRouter.post("/answer", (req: Request, res: Response) => {
  new AnswerTaskNotebookSessionController(
    answerTaskNotebookSessionUseCase
  ).execute(req, res);
});

taskNotebookSessionRouter.post("/finish", (req: Request, res: Response) => {
  new FinishTaskNotebookController(finishTaskNotebookSessionUseCase).execute(
    req,
    res
  );
});

export { taskNotebookSessionRouter };
