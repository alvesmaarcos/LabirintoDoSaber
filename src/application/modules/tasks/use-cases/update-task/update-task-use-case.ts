import {failure, success, Uuid} from "@wave-telecom/framework/core";
import {TaskRepository} from "../../../../../domain/repositories/task-repository";
import {
  TaskCategory,
  TaskType,
} from "../../../../../domain/entities/task";

interface UpdateTaskUseCaseRequest {
  id: string;
  category?: TaskCategory;
  type?: TaskType;
  prompt?: string;
  alternatives?: {
    text: string;
    isCorrect: boolean;
  }[];
  imageFile?: string;
  audioFile?: string;
}

export class UpdateTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(props: UpdateTaskUseCaseRequest) {
        if (!Uuid.isValid(props.id)) {
            return failure("INVALID_TASK_ID");
        }
        
        const existingTask = await this.taskRepository.getById(new Uuid(props.id));

        if (!existingTask) {
            return failure("TASK_NOT_FOUND");
        }

        const updateResult = existingTask.updateTask(props);

        if (!updateResult.ok) {
            return failure("INVALID_TASK_DATA");
        }

        const updatedTask = updateResult.value;

        await this.taskRepository.save(updatedTask);

        return success(void 0);
    }
}    
