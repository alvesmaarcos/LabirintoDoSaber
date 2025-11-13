import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";

interface DeleteTaskUseCaseRequest {
    taskId: Uuid;
}

export class DeleteTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(params: DeleteTaskUseCaseRequest) {
        try {
            if (!params.taskId) {
                return failure("TASK_ID_REQUIRED");
            }

            const idAsString = String(params.taskId);
            if (!Uuid.isValid(idAsString)) {
                return failure("INVALID_TASK_ID");
            }

            const existingTask = await this.taskRepository.getById(params.taskId);
            if (!existingTask) {
                return failure("TASK_NOT_FOUND");
            }
            
            await this.taskRepository.delete(params.taskId);
            return success(null);
        } catch {
            return failure("DELETE_TASK_FAILED");
        }
    }
}