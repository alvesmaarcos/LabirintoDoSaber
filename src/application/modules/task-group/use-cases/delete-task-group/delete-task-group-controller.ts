import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { DeleteTaskGroupUseCase } from "./delete-task-group-use-case";
import { deleteTaskGroupSchema } from "../../schemas/delete-task-group-schema";
import { Uuid } from "@wave-telecom/framework/core";

export class DeleteTaskGroupController extends BaseController {
    constructor(private useCase: DeleteTaskGroupUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await deleteTaskGroupSchema.safeParseAsync(req.params);
        
        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;
        
        const result = await this.useCase.execute({ 
            taskGroupId: new Uuid(payload.taskGroupId),
        });

        if (!result.ok) {
            return this.fail(res, result.error);
        }

        return this.ok(res, null);
    }
}