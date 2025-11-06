import z from "zod";
import { TaskNotebookCategory } from "../../../../domain/entities/task-notebook";

export const listTasksNotebooksSchema = z.object({
    id: z.string().uuid().optional(),
    educatorId: z.string().uuid().optional(),
    category: z.nativeEnum(TaskNotebookCategory).optional(),
    descriptionContains: z.string().optional(),
});
