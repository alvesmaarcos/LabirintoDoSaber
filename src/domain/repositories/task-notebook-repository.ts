import { Uuid } from "@wave-telecom/framework/core";
import { TaskNotebook, TaskNotebookCategory } from "../entities/task-notebook";

export interface SearchTaskNotebookProps {
  id?: Uuid;
  educatorId?: Uuid;
  category?: TaskNotebookCategory;
}

export interface TaskNotebookRepository {
  save(taskNotebook: TaskNotebook): Promise<TaskNotebook>;
  getById(id: Uuid): Promise<TaskNotebook | null>;
  search(props: SearchTaskNotebookProps): Promise<TaskNotebook[]>;
  delete(id: Uuid): Promise<void>;
}
