import z from "zod";
import { TaskNotebookCategory } from "../../../../domain/entities/task-notebook";

export const UpdateTaskNotebookSchema = z.object({
  taskNotebookId: z.string().uuid(),
  category: z.nativeEnum(TaskNotebookCategory).optional(),
  description: z.string().min(1).max(500).optional(),
  taskGroupsIds: z.array(z.string().uuid()).optional(),
});