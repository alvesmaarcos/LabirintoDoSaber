import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { UpdateTaskUseCase } from "./update-task-use-case";
import { updateTaskSchema } from "../../schemas/update-task-schemas";

export class UpdateTaskController extends BaseController {
    constructor(private useCase: UpdateTaskUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await updateTaskSchema.safeParseAsync(req.body);

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