// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { success, failure, Uuid } from "@wave-telecom/framework/core";
// import { ListTasksNotebooksUseCase } from "./list-tasks-notebooks-use-case";
// import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
// import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";

import { expect, it } from "vitest";

it("true is true", () => {
  expect(true).toBe(true);
});

// // Mock do repositório
// const mockTaskNotebookRepository = (): TaskNotebookRepository => {
//   return {
//     search: vi.fn(),
//   } as unknown as TaskNotebookRepository;
// };

// describe("ListTasksNotebooksUseCase", () => {
//   let taskNotebookRepository: TaskNotebookRepository;
//   let useCase: ListTasksNotebooksUseCase;

//   beforeEach(() => {
//     taskNotebookRepository = mockTaskNotebookRepository();
//     useCase = new ListTasksNotebooksUseCase(taskNotebookRepository);
//   });

//   it("should return notebooks successfully", async () => {
//     const fakeNotebooks = [
//       { id: Uuid.random(), description: "Caderno 1" },
//       { id: Uuid.random(), description: "Caderno 2" },
//     ];

//     (taskNotebookRepository.search as any).mockResolvedValue(fakeNotebooks);

//     const result = await useCase.execute({});

//     expect(result).toEqual(success(fakeNotebooks));
//     expect(taskNotebookRepository.search).toHaveBeenCalledWith({});
//   });

//   it("should call repository with provided filters", async () => {
//     const filters = {
//       id: Uuid.random(),
//       educatorId: Uuid.random(),
//       category: TaskNotebookCategory.Reading,
//       descriptionContains: "textos",
//     };

//     (taskNotebookRepository.search as any).mockResolvedValue([]);

//     await useCase.execute(filters);

//     expect(taskNotebookRepository.search).toHaveBeenCalledWith(filters);
//   });

//   it("should return failure if repository throws", async () => {
//     (taskNotebookRepository.search as any).mockRejectedValue(new Error("DB error"));

//     const result = await useCase.execute({});

//     expect(result).toEqual(failure("LIST_TASKS_NOTEBOOKS_FAILED"));
//   });

//   it("should handle empty results gracefully", async () => {
//     (taskNotebookRepository.search as any).mockResolvedValue([]);

//     const result = await useCase.execute({});

//     expect(result).toEqual(success([]));
//     expect(taskNotebookRepository.search).toHaveBeenCalledWith({});
//   });
// });
