import z from "zod";
import { TaskNotebookCategory } from "../../../../domain/entities/task-notebook";

export const CreateTaskNotebookSchema = z.object({
  tasks: z
    .array(z.string().uuid("each task must be a valid UUID"))
    .min(1, "at least one task is required"),
  category: z.nativeEnum(TaskNotebookCategory),
  description: z.string().min(1, "description is required"),
});
