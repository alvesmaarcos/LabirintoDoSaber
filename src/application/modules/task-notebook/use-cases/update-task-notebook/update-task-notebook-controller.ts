import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { UpdateTaskNotebookUseCase } from "./update-task-notebook-use-case";
import { UpdateTaskNotebookSchema } from "../../schemas/update-task-notebook-schema";

export class UpdateTaskNotebookController extends BaseController {
    constructor(private useCase: UpdateTaskNotebookUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await UpdateTaskNotebookSchema.safeParseAsync(req.body);

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;

        const result = await this.useCase.execute(payload);
        
        if (!result.ok) {
            return this.fail(res, result.error);
        }
        return this.ok(res, result.value);
    }
}