import z from "zod";

export const listTaskNotebookSessionByStudentId = z.object({
  studentId: z.string().uuid(),
});
