import { describe, it, expect, vi, beforeEach } from "vitest";
import { FinishTaskNotebookSessionUseCase } from "./finish-task-notebook-session-use-case";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";
import { success, failure, Uuid } from "@wave-telecom/framework/core";

// Factory para criar uma sessão mockada
const makeSession = ({
  id = Uuid.random().value,
  finished = false,
  finishSuccess = true,
} = {}) => {
  const session = {
    id: new Uuid(id),
    finishedAt: finished ? new Date() : undefined,
    finish: vi.fn().mockImplementation(() => {
      if (!finishSuccess) return failure("ERROR");
      return success({
        ...session,
        finishedAt: new Date(),
      });
    }),
  };

  return session;
};

// Mock do repositório
const mockSessionRepository = (): TaskNotebookSessionRepository =>
  ({
    getById: vi.fn(),
    save: vi.fn(),
  } as unknown as TaskNotebookSessionRepository);

describe("FinishTaskNotebookSessionUseCase", () => {
  let sessionRepository: TaskNotebookSessionRepository;
  let useCase: FinishTaskNotebookSessionUseCase;

  beforeEach(() => {
    sessionRepository = mockSessionRepository();
    useCase = new FinishTaskNotebookSessionUseCase(sessionRepository);
  });

  it("should fail if session does not exist", async () => {
    (sessionRepository.getById as any).mockResolvedValue(null);

    const result = await useCase.execute({ sessionId: Uuid.random().value });

    expect(result).toEqual(failure("SESSION_NOT_FOUND"));
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });

  it("should fail if session is already finished", async () => {
    const session = makeSession({ finished: true });
    (sessionRepository.getById as any).mockResolvedValue(session);

    const result = await useCase.execute({ sessionId: Uuid.random().value });

    expect(result).toEqual(failure("SESSION_ALREADY_FINISHED"));
    expect(session.finish).not.toHaveBeenCalled();
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });

  it("should fail if finish() returns an error", async () => {
    const session = makeSession({ finishSuccess: false });
    (sessionRepository.getById as any).mockResolvedValue(session);

    const result = await useCase.execute({ sessionId: Uuid.random().value });

    expect(result).toEqual(failure("SESSION_FINISH_FAILED"));
    expect(session.finish).toHaveBeenCalled();
    expect(sessionRepository.save).not.toHaveBeenCalled();
  });

  it("should finish session successfully", async () => {
    const session = makeSession({});
    (sessionRepository.getById as any).mockResolvedValue(session);

    const result = await useCase.execute({ sessionId: Uuid.random().value });

    expect(session.finish).toHaveBeenCalled();
    expect(sessionRepository.save).toHaveBeenCalled();
    const saved = (sessionRepository.save as any).mock.calls[0][0];

    expect(saved.finishedAt).toBeDefined();
    expect(result).toEqual(success(saved));
  });
});
