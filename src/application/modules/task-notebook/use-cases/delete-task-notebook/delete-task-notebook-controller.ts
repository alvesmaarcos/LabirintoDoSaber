import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { DeleteTaskNotebookUseCase } from "./delete-task-notebook-use-case";
import { DeleteTaskNotebookSchema } from "../../schemas/delete-task-notebook-schema";
import { Uuid } from "@wave-telecom/framework/core";

export class DeleteTaskNotebookController extends BaseController {
    constructor(private useCase: DeleteTaskNotebookUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await DeleteTaskNotebookSchema.safeParseAsync(req.params);

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;

        const result = await this.useCase.execute({ 
            taskNotebookId: new Uuid(payload.taskNotebookId),
        });

        if (!result.ok) {
            return this.fail(res, result.error);
        }

        return this.ok(res, null);
    }
}