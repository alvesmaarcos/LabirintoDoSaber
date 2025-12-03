import { Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSession } from "../entities/task-notebook-session";

export interface ListByEducatorIdParams {
  educatorId: Uuid;
  limit: number;
}

export interface TaskNotebookSessionRepository {
  save(session: TaskNotebookSession): Promise<void>;
  getById(id: Uuid): Promise<TaskNotebookSession | null>;
  listByStudentId(studentId: Uuid): Promise<TaskNotebookSession[]>;
  listByEducatorId(
    params: ListByEducatorIdParams
  ): Promise<TaskNotebookSession[]>;
}
