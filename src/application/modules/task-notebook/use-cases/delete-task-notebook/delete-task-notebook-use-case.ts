import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";

interface DeleteTaskNotebookUseCaseRequest {
    taskNotebookId: Uuid;
}

export class DeleteTaskNotebookUseCase {
    constructor(private taskNotebookRepository: TaskNotebookRepository) {}

    async execute(params: DeleteTaskNotebookUseCaseRequest) {
        try {
            if (!params.taskNotebookId) {
                return failure("TASK_NOTEBOOK_ID_REQUIRED");
            }

            const idAsString = params.taskNotebookId.value;
            if (!Uuid.isValid(idAsString)) {
                return failure("INVALID_TASK_NOTEBOOK_ID");
            }

            const existingTaskNotebook = await this.taskNotebookRepository.getById(params.taskNotebookId);
            if (!existingTaskNotebook) {
                return failure("TASK_NOTEBOOK_NOT_FOUND");
            }
            
            await this.taskNotebookRepository.delete(params.taskNotebookId);
            return success(null);
        } catch {
            return failure("DELETE_TASK_NOTEBOOK_FAILED");
        }
    }
}