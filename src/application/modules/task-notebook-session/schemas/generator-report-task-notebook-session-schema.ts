import z from "zod";

export const GeneratorReportTaskNotebookSessionSchema = z.object({
  sessionId: z.string().uuid(),
});