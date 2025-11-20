import {
  PrismaClient,
  TaskNotebookSession as prismaTaskNotebookSession,
} from "@prisma/client";
import { TaskNotebookSessionRepository } from "../../../domain/repositories/task-notebook-session-repository";
import { Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSession } from "../../../domain/entities/task-notebook-session";

export class TaskNotebokSessionRepositoryImpl
  implements TaskNotebookSessionRepository
{
  constructor(private prismaService: PrismaClient) {}
  async save(session: TaskNotebookSession): Promise<void> {
    await this.prismaService.taskNotebookSession.upsert({
      where: { id: session.id.value },
      create: {
        id: session.id.value,
        notebookId: session.notebookId.value,
        startedAt: session.startedAt,
        studentId: session.studentId.value,
        finishedAt: session.finishedAt,
      },
      update: {
        startedAt: session.startedAt,
        finishedAt: session.finishedAt,
      },
    });
  }

  async getById(id: Uuid): Promise<TaskNotebookSession | null> {
    const result = await this.prismaService.taskNotebookSession.findUnique({
      where: { id: id.value },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async listByStudentId(studentId: Uuid): Promise<TaskNotebookSession[]> {
    const results = await this.prismaService.taskNotebookSession.findMany({
      where: { studentId: studentId.value },
    });
    return results.map((data) => this.mapToEntity(data));
  }

  private mapToEntity(data: prismaTaskNotebookSession): TaskNotebookSession {
    return new TaskNotebookSession(
      new Uuid(data.id),
      new Uuid(data.studentId),
      new Uuid(data.notebookId),
      data.startedAt,
      data.finishedAt ?? undefined,
      data.answers.map((a) => ({
        taskId: new Uuid(a.taskId),
        selectedAlternativeId: new Uuid(a.selectedAlternativeId),
        isCorrect: a.isCorrect,
        timeToAnswer: a.timeToAnswer,
        answeredAt: a.answeredAt,
      }))
    );
  }
}
