import z from "zod";

export const startTaskSessionSchema = z.object({
  studentId: z.string().uuid(),
  notebookId: z.string().uuid(),
});
