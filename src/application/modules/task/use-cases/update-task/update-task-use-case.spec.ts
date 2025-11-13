import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTaskUseCase } from "./update-task-use-case";
import { success, failure, Uuid } from "@wave-telecom/framework/core";

describe("UpdateTaskUseCase", () => {
  const mockRepo = {
    getById: vi.fn(),
    save: vi.fn(),
  };

  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateTaskUseCase(mockRepo as any);
  });

  it("deve retornar erro se o ID for inválido", async () => {
    const result = await useCase.execute({ id: "id-invalido" });
    expect(result).toEqual(failure("INVALID_TASK_ID"));
  });

  it("deve retornar erro se a task não for encontrada", async () => {
    mockRepo.getById.mockResolvedValue(null);

    const id = Uuid.random().toString();
    const result = await useCase.execute({ id });

    expect(result).toEqual(failure("TASK_NOT_FOUND"));
    expect(mockRepo.getById).toHaveBeenCalled();
  });

  it("deve retornar erro se updateTask falhar", async () => {
    const fakeTask = {
      updateTask: vi.fn().mockReturnValue(failure("INVALID_TASK_DATA")),
    };

    mockRepo.getById.mockResolvedValue(fakeTask);

    const id = Uuid.random().toString();
    const result = await useCase.execute({ id });

    expect(fakeTask.updateTask).toHaveBeenCalled();
    expect(result).toEqual(failure("INVALID_TASK_DATA"));
  });

  it("deve atualizar a task com sucesso", async () => {
    const updatedTask = { id: Uuid.random() };

    const fakeTask = {
      updateTask: vi.fn().mockReturnValue(success(updatedTask)),
    };

    mockRepo.getById.mockResolvedValue(fakeTask);
    mockRepo.save.mockResolvedValue(void 0);

    const id = Uuid.random().toString();
    const result = await useCase.execute({ id, prompt: "Nova descrição" });

    expect(fakeTask.updateTask).toHaveBeenCalledWith({ id, prompt: "Nova descrição" });
    expect(mockRepo.save).toHaveBeenCalledWith(updatedTask);
    expect(result).toEqual(success(void 0));
  });
});
