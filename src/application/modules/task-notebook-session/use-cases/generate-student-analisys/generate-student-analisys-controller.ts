import {
  BaseController,
  formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import {
  GenerateStudentAnalysisUseCase,
  StudentAnalysisResponse,
} from "./generate-student-analisys-use-case";
import { Request, Response } from "express";
import { generateStudentAnalisysSchema } from "../../schemas/generate-student-analisys.schema";

export class GenerateStudentAnalysisController extends BaseController {
  constructor(private useCase: GenerateStudentAnalysisUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<unknown> {
    const validation = await generateStudentAnalisysSchema.safeParseAsync(
      req.params
    );

    if (!validation.success) {
      const errors = formatValidationErrors(validation.error);
      return this.clientError(res, undefined, errors);
    }

    const { studentId } = validation.data;

    const result = await this.useCase.execute({ studentId });

    if (!result.ok) {
      if (result.error === "STUDENT_NOT_FOUND") {
        return this.notFound(res, "STUDENT_NOT_FOUND");
      }
      return this.fail(res, result.error);
    }

    return this.ok<StudentAnalysisResponse>(res, result.value);
  }
}
