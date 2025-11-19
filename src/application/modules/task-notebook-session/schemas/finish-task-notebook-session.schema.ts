import z from "zod";

export const finishTaskNotebookSessionSchema = z.object({
  sessionId: z.string().uuid(),
});
