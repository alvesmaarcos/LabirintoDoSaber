import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { DeleteTaskUseCase } from "./delete-task-use-case";
import { deleteTaskSchema } from "../../schemas/delete-task-schemas";
import { Uuid } from "@wave-telecom/framework/core";

export class DeleteTaskController extends BaseController {
    constructor(private useCase: DeleteTaskUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await deleteTaskSchema.safeParseAsync(req.params);

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;

        const result = await this.useCase.execute({ 
            taskId: new Uuid(payload.id),
        });

        if (!result.ok) {
            return this.fail(res, result.error);
        }

        return this.ok(res, null);
    }
}