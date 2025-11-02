import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import { TaskCategory, TaskType } from "../../../../../domain/entities/task";

interface ListTasksUseCaseRequest {
    id?: Uuid;
    category?: TaskCategory;
    type?: TaskType;
    promptContains?: string;
}

export class ListTasksUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(params: ListTasksUseCaseRequest) {
        try {
            const tasks = await this.taskRepository.search(params);
            return success(tasks);
        } catch {
            return failure("LIST_TASKS_FAILED");
        }
    }
}