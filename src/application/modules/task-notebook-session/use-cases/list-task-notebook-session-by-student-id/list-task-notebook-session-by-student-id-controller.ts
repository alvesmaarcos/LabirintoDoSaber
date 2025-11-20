import {
  BaseController,
  formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { ListTaskNotebookSessionByStudentIdUseCase } from "./list-task-notebook-session-by-student-id-use-case";
import { Request, Response } from "express";
import { listTaskNotebookSessionByStudentId } from "../../schemas/list-task-notebook-session-by-student-id.schema";

export class ListTaskNotebookSessionByStudentIdController extends BaseController {
  constructor(
    private listTaskNotebookSessionByStudentIdUseCase: ListTaskNotebookSessionByStudentIdUseCase
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<unknown> {
    const validation = await listTaskNotebookSessionByStudentId.safeParseAsync(
      req.params
    );

    if (!validation.success) {
      const errors = formatValidationErrors(validation.error);
      return this.clientError(res, undefined, errors);
    }

    const result = await this.listTaskNotebookSessionByStudentIdUseCase.execute(
      validation.data
    );

    return this.ok(res, result);
  }
}
