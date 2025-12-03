import { failure, success } from "@wave-telecom/framework/core";
import { EducatorRepository } from "../../../../../domain/repositories/educator-repository";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";
import { StudentRepository } from "../../../../../domain/repositories/student-repository";

interface GetEducatorLastSessionsRequest {
  educatorEmail: string;
}

export class GetEducatorLastSessionsUseCase {
  constructor(
    private educatorRepository: EducatorRepository,
    private sessionRepository: TaskNotebookSessionRepository,
    private studentRepository: StudentRepository
  ) {}

  async execute(request: GetEducatorLastSessionsRequest) {
    const educatorExists = await this.educatorRepository.getByEmail(
      request.educatorEmail
    );

    if (!educatorExists) {
      return failure("EDUCATOR_NOT_FOUND");
    }

    const educatorLastSessions = await this.sessionRepository.listByEducatorId({
      educatorId: educatorExists.id,
      limit: 2,
    });
    console.log(educatorExists.id.value);
    console.log(educatorLastSessions);
    if (educatorLastSessions.length === 0) {
      return failure("EDUCATOR_DOES_NOT_HAVE_SESSIONS");
    }

    const result = await Promise.all(
      educatorLastSessions.map(async (session) => {
        const student = await this.studentRepository.getById(session.studentId);

        return {
          studentName: student?.name,
          sessionName: session.name,
        };
      })
    );

    return success(result);
  }
}
