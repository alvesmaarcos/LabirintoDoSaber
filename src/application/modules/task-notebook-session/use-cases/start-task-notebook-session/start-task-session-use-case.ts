import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookRepository } from "../../../../../domain/repositories/task-notebook-repository";
import { TaskNotebookSession } from "../../../../../domain/entities/task-notebook-session";
import { StudentRepository } from "../../../../../domain/repositories/student-repository";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";

export interface StartTaskNotebookSessionUseCaseRequest {
  studentId: string;
  name: string;
  educatorId: Uuid;
}

export class StartTaskNotebookSessionUseCase {
  constructor(
    private notebookRepository: TaskNotebookRepository,
    private sessionRepository: TaskNotebookSessionRepository,
    private studentRepository: StudentRepository
  ) {}

  async execute(request: StartTaskNotebookSessionUseCaseRequest) {
    const student = await this.studentRepository.getById(
      new Uuid(request.studentId)
    );

    if (!student) {
      return failure("STUDENT_NOT_FOUND");
    }

    const session = TaskNotebookSession.start(
      student.id,
      request.name,
      request.educatorId
    );

    if (!session.ok) {
      return failure("SESSION_CREATION_FAILED");
    }

    await this.sessionRepository.save(session.value);

    return success(session.value);
  }
}
