import { failure, success, Uuid } from "@wave-telecom/framework/core";
import {
  TaskNotebook,
  TaskNotebookCategory,
} from "../../../../../domain/entities/task-notebook";
import { EducatorRepository } from "../../../../../domain/repositories/educator-repository";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";

export interface CreateTaskNotebookRequest {
  educatorEmail: string;
  tasks: string[];
  category: TaskNotebookCategory;
  description: string;
}

export class CreateTaskNotebookUseCase {
  constructor(
    private taskNotebookRepository: TaskNotebookRepository,
    private educatorRepository: EducatorRepository,
    private taskRepository: TaskRepository
  ) {}

  async execute(props: CreateTaskNotebookRequest) {
    const educatorExists = await this.educatorRepository.getByEmail(
      props.educatorEmail
    );
    if (!educatorExists) {
      return failure("EDUCATOR_DOES_NOT_EXISTS");
    }

    const tasks = await Promise.all(
      props.tasks.map(async (taskId) => {
        return await this.taskRepository.getById(new Uuid(taskId));
      })
    );
    const existingTasks = tasks.filter(
      (t): t is NonNullable<typeof t> => t !== null
    );

    if (!tasks[0]) {
      return failure("TASKS_DOES_NOT_EXISTS");
    }
    const taskNotebookResult = TaskNotebook.create({
      educator: educatorExists,
      description: props.description,
      category: props.category,
      tasks: existingTasks,
    });

    if (!taskNotebookResult.ok) {
      return failure("TASK_NOTEBOOK_CREATION_FAILED");
    }

    const savedNotebook = await this.taskNotebookRepository.save(
      taskNotebookResult.value
    );

    return success(savedNotebook);
  }
}
