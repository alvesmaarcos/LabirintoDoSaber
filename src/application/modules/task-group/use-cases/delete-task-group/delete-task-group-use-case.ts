import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";

interface DeleteTaskGroupUseCaseRequest {
    taskGroupId: Uuid;
}

export class DeleteTaskGroupUseCase {
    constructor(private taskGroupRepository: TaskGroupRepository) {}

    async execute(params: DeleteTaskGroupUseCaseRequest) {
        try {
            if (!params.taskGroupId) {
                return failure("TASK_GROUP_ID_REQUIRED");
            }

            const idAsString = String(params.taskGroupId);
            if (!Uuid.isValid(idAsString)) {
                return failure("INVALID_TASK_GROUP_ID");
            }

            const existingTaskGroup = await this.taskGroupRepository.findById(params.taskGroupId);
            if (!existingTaskGroup) {
                return failure("TASK_GROUP_NOT_FOUND");
            }
            
            await this.taskGroupRepository.deleteById(params.taskGroupId);
            return success(null);
        } catch {
            return failure("DELETE_TASK_GROUP_FAILED");
        }
    }
}