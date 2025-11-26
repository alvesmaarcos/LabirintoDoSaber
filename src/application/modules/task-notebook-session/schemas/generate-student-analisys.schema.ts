import z from "zod";

export const generateStudentAnalisysSchema = z.object({
  studentId: z.string().uuid(),
});
