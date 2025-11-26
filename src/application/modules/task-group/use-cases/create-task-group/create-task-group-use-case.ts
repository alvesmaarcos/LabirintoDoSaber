import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskCategory } from "../../../../../domain/entities/task";
import { EducatorRepository } from "../../../../../domain/repositories/educator-repository";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";
import { TaskGroup } from "../../../../../domain/entities/task-group";

interface CreateTaskGroupUseCaseRequest {
  name: string;
  tasksId?: string[];
  educatorEmail: string;
  category: TaskCategory;
}

export class CreateTaskGroupUseCase {
  constructor(
    private taskGroupRepository: TaskGroupRepository,
    private educatorRepository: EducatorRepository
  ) {}

  async execute(request: CreateTaskGroupUseCaseRequest) {
    const educatorExists = await this.educatorRepository.getByEmail(
      request.educatorEmail
    );

    if (!educatorExists) {
      return failure("EDUCATOR_NOT_FOUND");
    }

    const taskGroup = TaskGroup.create({
      name: request.name,
      tasksId: request.tasksId,
      educatorId: educatorExists.id,
      category: request.category,
    });
    await this.taskGroupRepository.save(taskGroup);
    return success(taskGroup);
  }
}
