import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { ListTasksUseCase } from "./list-tasks-use-case";
import { listTasksSchema } from "../../schemas/list-tasks-schemas";
import { SearchTaskProps } from "../../../../../domain/repositories/task-repository";
import { Uuid } from "@wave-telecom/framework/core";

export class ListTasksController extends BaseController {
    constructor(private useCase: ListTasksUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await listTasksSchema.safeParseAsync(req.query);

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;

        const searchProps: SearchTaskProps = {
            id: payload.id ? new Uuid(payload.id) : undefined,
            category: payload.category,
            type: payload.type,
             promptContains: payload.promptContains,
        };

        const result = await this.useCase.execute(searchProps);

        if (!result.ok) {
            return this.fail(res, result.error);
        }

        return this.ok(res, result.value);
    }
}