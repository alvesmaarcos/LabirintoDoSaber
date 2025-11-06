import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskNotebookCategory } from "../../../../../domain/entities/task-notebook";

interface ListTasksNotebooksUseCaseRequest {
    id?: Uuid;
    educatorId?: Uuid;
    category?: TaskNotebookCategory;
    descriptionContains?: string;
}

export class ListTasksNotebooksUseCase {
    constructor(private taskNotebookRepository: TaskNotebookRepository) {} 
    
    async execute(params: ListTasksNotebooksUseCaseRequest) {
        try {
            const notebooks = await this.taskNotebookRepository.search(params);
            return success(notebooks);
        } catch {
            return failure("LIST_TASKS_NOTEBOOKS_FAILED");
        }
    }
}