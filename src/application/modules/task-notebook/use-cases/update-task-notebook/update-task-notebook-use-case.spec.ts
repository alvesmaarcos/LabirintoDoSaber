import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTaskNotebookUseCase } from "./update-task-notebook-use-case";
import { success, failure, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";

describe("UpdateTaskNotebookUseCase", () => {
  const mockRepo = {
    getById: vi.fn(),
    save: vi.fn(),
  };

  let useCase: UpdateTaskNotebookUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateTaskNotebookUseCase(mockRepo as any);
  });

  // ---------------------------------------------------------
  // 1. VALIDAÇÃO DE ID
  // ---------------------------------------------------------
  it("deve retornar erro se o ID for inválido", async () => {
    const result = await useCase.execute({ taskNotebookId: "id-invalido" });

    expect(result).toEqual(failure("INVALID_TASK_NOTEBOOK_ID"));
    expect(mockRepo.getById).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // 2. NOTEBOOK NÃO ENCONTRADO
  // ---------------------------------------------------------
  it("deve retornar erro se o TaskNotebook não for encontrado", async () => {
    mockRepo.getById.mockResolvedValue(null);

    const id = Uuid.random().toString();
    const result = await useCase.execute({ taskNotebookId: id });

    expect(result).toEqual(failure("TASK_NOTEBOOK_NOT_FOUND"));
    expect(mockRepo.getById).toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // 3. ERRO DE DOMÍNIO (updateTaskNotebook retorna failure)
  // ---------------------------------------------------------
  it("deve retornar erro se updateTaskNotebook falhar", async () => {
    const fakeNotebook = {
      updateTaskNotebook: vi.fn().mockReturnValue(failure("INVALID_TASK_NOTEBOOK_DATA")),
    };

    mockRepo.getById.mockResolvedValue(fakeNotebook);

    const id = Uuid.random().toString();
    const result = await useCase.execute({
      taskNotebookId: id,
      description: "descrição teste",
    });

    expect(fakeNotebook.updateTaskNotebook).toHaveBeenCalled();
    expect(result).toEqual(failure("INVALID_TASK_NOTEBOOK_DATA"));
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // 4. SUCESSO NO UPDATE
  // ---------------------------------------------------------
  it("deve atualizar o TaskNotebook com sucesso", async () => {
    const updatedNotebook = {
      id: Uuid.random(),
      description: "Descrição nova",
      category: TaskNotebookCategory.Reading,
      taskGroupsIds: [],
    };

    const fakeNotebook = {
      updateTaskNotebook: vi.fn().mockReturnValue(success(updatedNotebook)),
    };

    mockRepo.getById.mockResolvedValue(fakeNotebook);
    mockRepo.save.mockResolvedValue(void 0);

    const id = Uuid.random().toString();

    const payload = {
      taskNotebookId: id,
      description: "Descrição nova",
      category: TaskNotebookCategory.Reading,
      taskGroupsIds: [],
    };

    const result = await useCase.execute(payload);

    expect(fakeNotebook.updateTaskNotebook).toHaveBeenCalledWith(payload);
    expect(mockRepo.save).toHaveBeenCalledWith(updatedNotebook);
    expect(result).toEqual(success(void 0));
  });

    // 6. ERRO DE INFRA (save)
  // ---------------------------------------------------------
});
