import { describe, it, expect } from "vitest";
import { Task, TaskCategory, TaskType } from "../../entities/task";
import {
  TaskNotebook,
  TaskNotebookCategory,
} from "../../entities/task-notebook";
import { Educator } from "../../entities/educator";
import { failure, Uuid } from "@wave-telecom/framework/core";

describe("TaskNotebook Entity", () => {
  const mockEducator = Educator.create({
    id: Uuid.random(),
    name: "John Doe",
    email: "john@example.com",
    password: "123",
  });

  const validTaskResult = Task.create({
    category: TaskCategory.Reading,
    type: TaskType.MultipleChoice,
    prompt: "Escolha a alternativa correta",
    alternatives: [
      { text: "Errada", isCorrect: false },
      { text: "Correta", isCorrect: true },
    ],
  });

  it("should create a valid TaskNotebook", () => {
    const result = TaskNotebook.create({
      educator: mockEducator,
      category: TaskNotebookCategory.Comprehension,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.educator.name).toBe("John Doe");
      expect(result.value.tasks.length).toBe(0);
    }
  });

  it("should create a TaskNotebook with pre-existing tasks", () => {
    if (!validTaskResult.ok) throw new Error("Task inválida para teste");
    const task = validTaskResult.value;

    const result = TaskNotebook.create({
      educator: mockEducator,
      tasks: [task],
      category: TaskNotebookCategory.Comprehension,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.tasks.length).toBe(1);
      expect(result.value.tasks[0].prompt).toBe(
        "Escolha a alternativa correta"
      );
    }
  });

  it("should add a task successfully", () => {
    if (!validTaskResult.ok) throw new Error("Task inválida para teste");
    const task = validTaskResult.value;

    const notebookResult = TaskNotebook.create({
      educator: mockEducator,
      category: TaskNotebookCategory.Comprehension,
    });
    if (!notebookResult.ok) throw new Error("Notebook inválido para teste");

    const notebook = notebookResult.value;
    const updatedResult = notebook.addTask(task);

    expect(updatedResult.ok).toBe(true);
    if (updatedResult.ok) {
      expect(updatedResult.value.tasks.length).toBe(1);
      expect(updatedResult.value.tasks[0].id).toBe(task.id);
    }
  });

  it("should fail to add a duplicated task", () => {
    if (!validTaskResult.ok) throw new Error("Task inválida para teste");
    const task = validTaskResult.value;

    const notebookResult = TaskNotebook.create({
      educator: mockEducator,
      tasks: [task],
      category: TaskNotebookCategory.Comprehension,
    });
    if (!notebookResult.ok) throw new Error("Notebook inválido para teste");

    const notebook = notebookResult.value;
    const duplicateResult = notebook.addTask(task);

    expect(duplicateResult).toEqual(failure("TASK_ALREADY_EXISTS"));
  });

  it("should list all tasks correctly", () => {
    if (!validTaskResult.ok) throw new Error("Task inválida para teste");
    const task = validTaskResult.value;

    const notebookResult = TaskNotebook.create({
      educator: mockEducator,
      tasks: [task],
      category: TaskNotebookCategory.Comprehension,
    });
    if (!notebookResult.ok) throw new Error("Notebook inválido para teste");

    const listResult = notebookResult.value.listTasks();

    expect(listResult.ok).toBe(true);
    if (listResult.ok) {
      expect(listResult.value.length).toBe(1);
      expect(listResult.value[0].prompt).toBe("Escolha a alternativa correta");
    }
  });
});
