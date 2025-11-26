import { Uuid } from "@wave-telecom/framework/core";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";

export class ListByEducatorUseCase {
  constructor(private taskGroupRepository: TaskGroupRepository) {}

  async execute(educatorId: Uuid) {
    const taskGroups = await this.taskGroupRepository.search({ educatorId });
    return taskGroups;
  }
}
