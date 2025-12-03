import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";
import { StudentRepository } from "../../../../../domain/repositories/student-repository";
import { failure, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSession } from "../../../../../domain/entities/task-notebook-session";
import { StartTaskNotebookSessionUseCase } from "./start-task-session-use-case";

const mockNotebookRepository = (): TaskNotebookRepository =>
  ({
    getById: vi.fn(),
  } as any);

const mockSessionRepository = (): TaskNotebookSessionRepository =>
  ({
    save: vi.fn(),
    getById: vi.fn(),
  } as any);

const mockStudentRepository = (): StudentRepository =>
  ({
    getById: vi.fn(),
  } as any);

describe("StartTaskNotebookSessionUseCase", () => {
  let notebookRepo: TaskNotebookRepository;
  let sessionRepo: TaskNotebookSessionRepository;
  let studentRepo: StudentRepository;
  let useCase: StartTaskNotebookSessionUseCase;

  beforeEach(() => {
    vi.restoreAllMocks(); // <-- IMPORTANTE
    notebookRepo = mockNotebookRepository();
    sessionRepo = mockSessionRepository();
    studentRepo = mockStudentRepository();
    useCase = new StartTaskNotebookSessionUseCase(
      notebookRepo,
      sessionRepo,
      studentRepo
    );
  });

  it("should fail if student is not found", async () => {
    (studentRepo.getById as any).mockResolvedValue(null);
    (notebookRepo.getById as any).mockResolvedValue({});

    const result = await useCase.execute({
      studentId: Uuid.random().value,
      name: Uuid.random().value,
      educatorId: Uuid.random(),
    });

    expect(result).toEqual(failure("STUDENT_NOT_FOUND"));
    expect(sessionRepo.save).not.toHaveBeenCalled();
  });

  it("should fail if session creation fails internally", async () => {
    (studentRepo.getById as any).mockResolvedValue({ id: Uuid.random() });
    (notebookRepo.getById as any).mockResolvedValue({ id: Uuid.random() });

    const spy = vi
      .spyOn(TaskNotebookSession, "start")
      .mockReturnValue(failure("ANY") as any);

    const result = await useCase.execute({
      studentId: Uuid.random().value,
      name: Uuid.random().value,
      educatorId: Uuid.random(),
    });

    spy.mockRestore();

    expect(result).toEqual(failure("SESSION_CREATION_FAILED"));
    expect(sessionRepo.save).not.toHaveBeenCalled();
  });

  it("should start a new session successfully", async () => {
    const studentId = Uuid.random();
    const notebookId = Uuid.random();

    (studentRepo.getById as any).mockResolvedValue({ id: studentId });
    (notebookRepo.getById as any).mockResolvedValue({ id: notebookId });

    const executeResult = await useCase.execute({
      studentId: studentId.value,
      name: notebookId.value,
      educatorId: Uuid.random(),
    });

    expect(executeResult.ok).toBe(true);

    expect(sessionRepo.save).toHaveBeenCalled();
    const savedSession = (sessionRepo.save as any).mock.calls[0][0];

    expect(savedSession).toBeTruthy();
    expect(savedSession.studentId).toEqual(studentId);
    expect(savedSession.name).toEqual(notebookId.value);
    expect(savedSession.answers.length).toBe(0);
    expect(savedSession.startedAt).toBeInstanceOf(Date);
  });
});
