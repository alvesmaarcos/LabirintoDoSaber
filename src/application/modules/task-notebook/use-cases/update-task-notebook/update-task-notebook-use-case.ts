import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";

interface UpdateTaskNotebookUseCaseRequest {
    taskNotebookId: string;
    description?: string;
    category?: TaskNotebookCategory;
    taskGroupsIds?: string[];
}

export class UpdateTaskNotebookUseCase {
    constructor(private taskNotebookRepository: TaskNotebookRepository) {}

    async execute(props: UpdateTaskNotebookUseCaseRequest) {
        if (!Uuid.isValid(props.taskNotebookId)) {
            return failure("INVALID_TASK_NOTEBOOK_ID");
        }
    
        const existingNotebook = await this.taskNotebookRepository.getById(new Uuid(props.taskNotebookId));

        if (!existingNotebook) {
            return failure("TASK_NOTEBOOK_NOT_FOUND");
        }

        const updateResult = existingNotebook.updateTaskNotebook(props);

        if (!updateResult.ok) {
            return failure("INVALID_TASK_NOTEBOOK_DATA");
        }

        const updatedNotebook = updateResult.value;

        await this.taskNotebookRepository.save(updatedNotebook);

        return success(void 0);
    }
}   