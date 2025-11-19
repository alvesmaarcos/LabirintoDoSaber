import {
  BaseController,
  formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { GeneratorReportTaskNotebookSessionUseCase } from "./generator-report-task-notebook-session-use-case";
import { Request, Response } from "express";
import { GeneratorReportTaskNotebookSessionSchema } from "../../schemas/generator-report-task-notebook-session-schema";

export class GeneratorReportTaskNotebookSessionController extends BaseController {
  constructor(
    private useCase: GeneratorReportTaskNotebookSessionUseCase) {
    super();
  }
    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await GeneratorReportTaskNotebookSessionSchema.safeParseAsync(
            req.params  
        );

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;
        const result = await this.useCase.execute(payload);

        if (!result.ok) {
            if (result.error === "SESSION_NOT_FOUND") {
                return this.notFound(res, result.error);
            } else {
                return this.fail(res, result.error);
            }
        }

        return this.ok(res, result.value);
    }

}
