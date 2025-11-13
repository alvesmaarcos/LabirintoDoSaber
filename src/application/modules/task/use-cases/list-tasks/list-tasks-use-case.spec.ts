import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import { TaskCategory, TaskType } from "../../../../../domain/entities/task";
import { ListTasksUseCase } from "./list-tasks-use-case";
import { success, failure, Uuid } from "@wave-telecom/framework/core";

// Mock do repositório
const mockTaskRepository = (): TaskRepository => {
  return {
    save: vi.fn(),
    getById: vi.fn(),
    search: vi.fn(),
    delete: vi.fn(),
  } as unknown as TaskRepository;
};

describe("ListTasksUseCase", () => {
  let taskRepository: TaskRepository;
  let useCase: ListTasksUseCase;

  beforeEach(() => {
    taskRepository = mockTaskRepository();
    useCase = new ListTasksUseCase(taskRepository);
  });

  it("should return tasks successfully", async () => {
    const fakeTasks = [
      {
        id: Uuid.random(),
        category: TaskCategory.Reading,
        type: TaskType.MultipleChoice,
        prompt: "Questão 1",
      },
      {
        id: Uuid.random(),
        category: TaskCategory.Writing,
        type: TaskType.MultipleChoiceWithMedia,
        prompt: "Questão 2",
      },
    ];

    (taskRepository.search as any).mockResolvedValue(fakeTasks);

    const result = await useCase.execute({});

    expect(result).toEqual(success(fakeTasks));
    expect(taskRepository.search).toHaveBeenCalledWith({});
  });

  it("should call repository with provided filters", async () => {
    const filters = {
      id: Uuid.random(),
      category: TaskCategory.Vocabulary,
      type: TaskType.MultipleChoice,
      promptContains: "matemática",
    };

    (taskRepository.search as any).mockResolvedValue([]);

    await useCase.execute(filters);

    expect(taskRepository.search).toHaveBeenCalledWith(filters);
  });

  it("should return failure if repository throws", async () => {
    (taskRepository.search as any).mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute({});

    expect(result).toEqual(failure("LIST_TASKS_FAILED"));
  });

  it("should handle empty results gracefully", async () => {
    (taskRepository.search as any).mockResolvedValue([]);

    const result = await useCase.execute({});

    expect(result).toEqual(success([]));
    expect(taskRepository.search).toHaveBeenCalledWith({});
  });
});
