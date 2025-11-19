import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";

export interface FinishTaskNotebookSessionUseCaseRequest {
  sessionId: string;
}

export class FinishTaskNotebookSessionUseCase {
  constructor(private sessionRepository: TaskNotebookSessionRepository) {}

  async execute(request: FinishTaskNotebookSessionUseCaseRequest) {
    const sessionId = new Uuid(request.sessionId);

    const session = await this.sessionRepository.getById(sessionId);

    if (!session) {
      return failure("SESSION_NOT_FOUND");
    }

    if (session.finishedAt) {
      return failure("SESSION_ALREADY_FINISHED");
    }

    const updated = session.finish();

    if (!updated.ok) {
      return failure("SESSION_FINISH_FAILED");
    }

    await this.sessionRepository.save(updated.value);

    return success(updated.value);
  }
}
