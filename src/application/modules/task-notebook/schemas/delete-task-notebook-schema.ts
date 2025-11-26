import z from 'zod';

export const DeleteTaskNotebookSchema = z.object({
  taskNotebookId: z.string().uuid(),
});