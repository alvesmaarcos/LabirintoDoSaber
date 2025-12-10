import z from 'zod';

export const deleteTaskGroupSchema = z.object({
  taskGroupId: z.string().uuid(),
});