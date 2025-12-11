import z from "zod";
import { TaskCategory } from "../../../../domain/entities/task";

export const CreateTaskGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tasksIds: z.array(z.string().uuid()).optional(),
  category: z.nativeEnum(TaskCategory),
});
