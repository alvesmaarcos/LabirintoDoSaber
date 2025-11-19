import { describe, it, expect, vi, beforeEach } from "vitest";
import { failure, success, Uuid } from "@wave-telecom/framework/core";

import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskAnswer } from "../../../../../domain/entities/task-notebook-session";
import { AnswerTaskNotebookSessionUseCase } from "./answer-task-notebook-session-use-case";

const ID = {
  session: Uuid.random().value,
  task: Uuid.random().value,
  altCorrect: Uuid.random().value,
  altWrong: Uuid.random().value,
  notebook: Uuid.random().value,
};

const makeSession = (
  sessionId: string,
  notebookId: string,
  finished = false,
  answers: TaskAnswer[] = []
) => {
  const session = {
    id: new Uuid(sessionId),
    notebookId: new Uuid(notebookId),
    finishedAt: finished ? new Date() : undefined,
    answers,
    answerTask: vi.fn().mockImplementation((a: TaskAnswer) =>
      success({
        ...session,
        answers: [...session.answers, a],
      })
    ),
  };

  return session;
};

const makeTask = (taskId: string, correctAltId: string) => ({
  id: new Uuid(taskId),
  alternatives: [
    { id: new Uuid(correctAltId), isCorrect: true },
    { id: new Uuid(ID.altWrong), isCorrect: false },
  ],
});

const makeNotebook = (notebookId: string, taskIds: string[]) => ({
  id: new Uuid(notebookId),
  tasks: taskIds.map((id) => ({ id: new Uuid(id) })),
});

const mockSessionRepository = (): TaskNotebookSessionRepository =>
  ({
    getById: vi.fn(),
    save: vi.fn(),
  } as unknown as TaskNotebookSessionRepository);

const mockTaskRepository = (): TaskRepository =>
  ({
    getById: vi.fn(),
  } as unknown as TaskRepository);

const mockNotebookRepository = (): TaskNotebookRepository =>
  ({
    getById: vi.fn(),
  } as unknown as TaskNotebookRepository);

describe("AnswerTaskNotebookSessionUseCase", () => {
  let sessionRepo: TaskNotebookSessionRepository;
  let taskRepo: TaskRepository;
  let notebookRepo: TaskNotebookRepository;
  let useCase: AnswerTaskNotebookSessionUseCase;

  beforeEach(() => {
    sessionRepo = mockSessionRepository();
    taskRepo = mockTaskRepository();
    notebookRepo = mockNotebookRepository();

    useCase = new AnswerTaskNotebookSessionUseCase(
      sessionRepo,
      taskRepo,
      notebookRepo
    );
  });

  it("should fail if session is not found", async () => {
    (sessionRepo.getById as any).mockResolvedValue(null);

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("SESSION_NOT_FOUND"));
  });

  it("should fail if session is already finished", async () => {
    const session = makeSession(ID.session, ID.notebook, true);

    (sessionRepo.getById as any).mockResolvedValue(session);

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("SESSION_ALREADY_FINISHED"));
  });

  it("should fail if task is not found", async () => {
    const session = makeSession(ID.session, ID.notebook);

    (sessionRepo.getById as any).mockResolvedValue(session);
    (taskRepo.getById as any).mockResolvedValue(null);

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("TASK_NOT_FOUND"));
  });

  it("should fail if notebook is not found", async () => {
    const session = makeSession(ID.session, ID.notebook);

    (sessionRepo.getById as any).mockResolvedValue(session);
    (taskRepo.getById as any).mockResolvedValue(
      makeTask(ID.task, ID.altCorrect)
    );
    (notebookRepo.getById as any).mockResolvedValue(null);

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("NOTEBOOK_NOT_FOUND"));
  });

  it("should fail if task does not belong to the notebook", async () => {
    const session = makeSession(ID.session, ID.notebook);

    (sessionRepo.getById as any).mockResolvedValue(session);
    (taskRepo.getById as any).mockResolvedValue(
      makeTask(ID.task, ID.altCorrect)
    );

    (notebookRepo.getById as any).mockResolvedValue(
      makeNotebook(ID.notebook, []) // no tasks
    );

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("TASK_NOT_IN_NOTEBOOK"));
  });

  it("should fail if task is already answered", async () => {
    const session = {
      ...makeSession(ID.session, ID.notebook),
      answers: [
        {
          taskId: new Uuid(ID.task),
          selectedAlternativeId: new Uuid(ID.altWrong),
          isCorrect: false,
          answeredAt: new Date(),
          timeToAnswer: 5,
        },
      ],
    };

    (sessionRepo.getById as any).mockResolvedValue(session);

    (taskRepo.getById as any).mockResolvedValue(
      makeTask(ID.task, ID.altCorrect)
    );
    (notebookRepo.getById as any).mockResolvedValue(
      makeNotebook(ID.notebook, [ID.task])
    );

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 10,
    });

    expect(result).toEqual(failure("TASK_ALREADY_ANSWERED"));
  });

  it("should answer the task successfully", async () => {
    const session = makeSession(ID.session, ID.notebook);

    (sessionRepo.getById as any).mockResolvedValue(session);
    (taskRepo.getById as any).mockResolvedValue(
      makeTask(ID.task, ID.altCorrect)
    );

    (notebookRepo.getById as any).mockResolvedValue(
      makeNotebook(ID.notebook, [ID.task])
    );

    const result = await useCase.execute({
      sessionId: ID.session,
      taskId: ID.task,
      selectedAlternativeId: ID.altCorrect,
      timeToAnswer: 12,
    });

    expect(result.ok).toBe(true);
    expect(sessionRepo.save).toHaveBeenCalled();

    const saved = (sessionRepo.save as any).mock.calls[0][0];

    expect(saved.answers.length).toBe(1);
    expect(saved.answers[0].isCorrect).toBe(true);
  });
});
