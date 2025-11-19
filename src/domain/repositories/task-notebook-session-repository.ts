import { Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSession } from "../entities/task-notebook-session";

export interface TaskNotebookSessionRepository {
  save(session: TaskNotebookSession): Promise<void>;
  getById(id: Uuid): Promise<TaskNotebookSession | null>;
}
