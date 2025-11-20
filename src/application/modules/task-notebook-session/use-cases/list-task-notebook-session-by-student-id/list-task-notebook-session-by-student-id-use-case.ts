import { Uuid } from "@wave-telecom/framework/core";
import { TaskNotebookSession } from "../../../../../domain/entities/task-notebook-session";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";

interface IListTaskNotebookSessionByStudentRequest {
  studentId: string;
}

export class ListTaskNotebookSessionByStudentIdUseCase {
  constructor(
    private taskNotebookSessionRepository: TaskNotebookSessionRepository
  ) {}

  async execute(
    props: IListTaskNotebookSessionByStudentRequest
  ): Promise<TaskNotebookSession[]> {
    const result = await this.taskNotebookSessionRepository.listByStudentId(
      new Uuid(props.studentId)
    );
    return result;
  }
}
