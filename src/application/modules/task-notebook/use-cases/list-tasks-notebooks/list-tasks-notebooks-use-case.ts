import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";

interface ListTasksNotebooksUseCaseRequest {
  id?: Uuid;
  educatorId?: Uuid;
  category?: TaskNotebookCategory;
  descriptionContains?: string;
}

export class ListTasksNotebooksUseCase {
  constructor(
    private taskNotebookRepository: TaskNotebookRepository,
    private taskGroupRepository: TaskGroupRepository
  ) {}

  async execute(params: ListTasksNotebooksUseCaseRequest) {
    try {
      const notebooks = await this.taskNotebookRepository.search(params);

      const result = await Promise.all(
        notebooks.map(async (notebook) => {
          const groups = notebook.taskGroupsIds;

          const taskGroups = await Promise.all(
            groups.map(async (groupId) => {
              return this.taskGroupRepository.findById(new Uuid(groupId));
            })
          );

          return {
            notebook,
            taskGroups: taskGroups.filter((g) => g !== null),
          };
        })
      );

      return success(result);
    } catch {
      return failure("LIST_TASKS_NOTEBOOKS_FAILED");
    }
  }
}
