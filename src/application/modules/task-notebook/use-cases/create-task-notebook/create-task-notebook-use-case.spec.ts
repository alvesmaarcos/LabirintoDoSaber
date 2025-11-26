import { describe, it, expect, vi, beforeEach } from "vitest";
import { Uuid, failure } from "@wave-telecom/framework/core";
import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";
import { Task, TaskCategory } from "../../../../../domain/entities/task";
import { CreateTaskNotebookUseCase } from "./create-task-notebook-use-case";

const mockEducatorRepository = { getByEmail: vi.fn() };
const mockTaskRepository = { getById: vi.fn() };
const mockTaskNotebookRepository = { save: vi.fn() };

let useCase: CreateTaskNotebookUseCase;

beforeEach(() => {
  vi.clearAllMocks();
  useCase = new CreateTaskNotebookUseCase(
    mockTaskNotebookRepository as any,
    mockEducatorRepository as any,
    mockTaskRepository as any
  );
});

const mockEducator = {
  id: Uuid.random(),
  name: "Maria",
  email: "maria@example.com",
};

const mockTaskResult = Task.create({
  category: TaskCategory.Reading,
  type: 0,
  prompt: "Qual é a capital da França?",
  alternatives: [
    { text: "Paris", isCorrect: true },
    { text: "Londres", isCorrect: false },
  ],
});

if (!mockTaskResult.ok) throw new Error("Mock task inválida");
const mockTask = mockTaskResult.value;

describe("CreateTaskNotebookUseCase", () => {
  it("should fail if educator does not exist", async () => {
    mockEducatorRepository.getByEmail.mockResolvedValue(null);

    const result = await useCase.execute({
      educatorEmail: "inexistente@example.com",
      tasks: [Uuid.random().toString()],
      category: TaskNotebookCategory.Reading,
      description: "Caderno de leitura inicial",
    });

    expect(result).toEqual(failure("EDUCATOR_DOES_NOT_EXISTS"));
  });

  it("should fail if no tasks exist", async () => {
    mockEducatorRepository.getByEmail.mockResolvedValue(mockEducator);
    mockTaskRepository.getById.mockResolvedValue(null);

    const result = await useCase.execute({
      educatorEmail: "maria@example.com",
      tasks: [Uuid.random().toString()],
      category: TaskNotebookCategory.Writing,
      description: "Caderno de escrita",
    });

    expect(result).toEqual(failure("TASKS_DOES_NOT_EXISTS"));
  });

  it("should fail if TaskNotebook.create fails", async () => {
    const { TaskNotebook } = await import(
      "../../../../../domain/entities/task-notebook"
    );
    const spy = vi
      .spyOn(TaskNotebook, "create")
      .mockReturnValue({ ok: false } as any);

    mockEducatorRepository.getByEmail.mockResolvedValue(mockEducator);
    mockTaskRepository.getById.mockResolvedValue(mockTask);

    const result = await useCase.execute({
      educatorEmail: "maria@example.com",
      tasks: [mockTask.id.toString()],
      category: TaskNotebookCategory.Vocabulary,
      description: "Teste de falha no create",
    });

    expect(result).toEqual(failure("TASK_NOTEBOOK_CREATION_FAILED"));
    spy.mockRestore();
  });

  it("should create and save a TaskNotebook successfully", async () => {
    mockEducatorRepository.getByEmail.mockResolvedValue(mockEducator);
    mockTaskRepository.getById.mockResolvedValue(mockTask);
    mockTaskNotebookRepository.save.mockImplementation(async (nb) => nb);

    const result = await useCase.execute({
      educatorEmail: "maria@example.com",
      tasks: [mockTask.id.toString()],
      category: TaskNotebookCategory.Comprehension,
      description: "Caderno de compreensão",
    });

    expect(result).toBeDefined();
    if ("educator" in result) {
      if (!result.ok) {
        throw new Error("SHOULD BE OK");
      }
      expect(result.value.educator.name).toBe("Maria");
      expect(result.value.tasks.length).toBe(1);
      expect(result.value.tasks[0].prompt).toBe("Qual é a capital da França?");
    }
    expect(mockTaskNotebookRepository.save).toHaveBeenCalledOnce();
  });
});
