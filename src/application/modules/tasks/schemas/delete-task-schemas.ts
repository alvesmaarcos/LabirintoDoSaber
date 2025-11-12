import z from "zod";

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
});
