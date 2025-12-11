import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { UpdateTaskGroupUseCase } from "./update-task-group-use-case";
import { UpdateTaskGroupSchema } from "../../schemas/update-task-group-schema";

export class UpdateTaskGroupController extends BaseController {
    constructor(private useCase: UpdateTaskGroupUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await UpdateTaskGroupSchema.safeParseAsync(req.body);

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