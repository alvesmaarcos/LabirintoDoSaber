import { failure, success, Uuid } from "@wave-telecom/framework/core";

export interface TaskAnswer {
  taskId: Uuid;
  selectedAlternativeId: Uuid;
  isCorrect: boolean;
  timeToAnswer: number; // em segundos
  answeredAt: Date;
}

export class TaskNotebookSession {
  constructor(
    public readonly id: Uuid,
    public readonly studentId: Uuid,
    public readonly notebookId: Uuid,
    public readonly startedAt: Date,
    public readonly finishedAt?: Date,
    public readonly answers: TaskAnswer[] = []
  ) {}

  static start(studentId: Uuid, notebookId: Uuid) {
    return success(
      new TaskNotebookSession(
        Uuid.random(),
        studentId,
        notebookId,
        new Date(),
        undefined,
        []
      )
    );
  }

  public answerTask(answer: TaskAnswer) {
    const exists = this.answers.some((a) => a.taskId === answer.taskId);
    if (exists) return failure("TASK_ALREADY_ANSWERED");

    const updated = new TaskNotebookSession(
      this.id,
      this.studentId,
      this.notebookId,
      this.startedAt,
      this.finishedAt,
      [...this.answers, answer]
    );
    return success(updated);
  }

  public finish() {
    return success(
      new TaskNotebookSession(
        this.id,
        this.studentId,
        this.notebookId,
        this.startedAt,
        new Date(),
        this.answers
      )
    );
  }
}
