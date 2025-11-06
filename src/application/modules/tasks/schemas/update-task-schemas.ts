import z from 'zod';
import { TaskCategory, TaskType } from '../../../../domain/entities/task';

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  category: z.nativeEnum(TaskCategory).optional(),
  type: z.nativeEnum(TaskType).optional(),
  prompt: z.string().min(1).optional(),
  alternatives: z.array(
    z.object({
      text: z.string().min(1),
      isCorrect: z.boolean(),
    })
  ).optional(),
  imageFile: z.string().optional(),
  audioFile: z.string().optional(),
}); 

