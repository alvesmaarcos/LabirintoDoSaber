import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";
import { TaskCategory } from "../../../../../domain/entities/task";

interface UpdateTaskGroupUseCaseRequest {
  id: string;
  name?: string;
  tasksIds?: string[];
  educatorId?: string;
  category?: TaskCategory;
}

export class UpdateTaskGroupUseCase {
  constructor(private taskGroupRepository: TaskGroupRepository) {}

  async execute(props: UpdateTaskGroupUseCaseRequest) {
   try { 
        if (!props.id || !Uuid.isValid(props.id)) {
            return failure("INVALID_TASK_GROUP_ID");
        }

        const existingTaskGroup = await this.taskGroupRepository.findById(
            new Uuid(props.id)
        );

        if (!existingTaskGroup) {
            return failure("TASK_GROUP_NOT_FOUND");
        }

        const updatedTaskGroupResult = existingTaskGroup.updateTaskGroup(props); 

        if (!updatedTaskGroupResult.ok) {
            return failure("INVALID_TASK_GROUP_DATA");
        }

        const updatedTaskGroup = updatedTaskGroupResult.value;

        await this.taskGroupRepository.save(updatedTaskGroup); 

        return success(void 0);
        
    } catch (error) {
        return failure("UPDATE_TASK_GROUP_FAILED"); 
    }
  }
}