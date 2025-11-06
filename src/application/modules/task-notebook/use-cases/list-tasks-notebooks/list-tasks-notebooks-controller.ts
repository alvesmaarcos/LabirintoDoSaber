import {
    BaseController,
    formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { ListTasksNotebooksUseCase } from "./list-tasks-notebooks-use-case";
import { listTasksNotebooksSchema } from "../../schemas/list-tasks-notebooks-schemas";
import { SearchTaskNotebookProps } from "../../../../../domain/repositories/task-notebook-repository";
import { Uuid } from "@wave-telecom/framework/core";

export class ListTasksNotebooksController extends BaseController {
    constructor(private useCase: ListTasksNotebooksUseCase) {
        super();
    }

    async executeImpl(req: Request, res: Response): Promise<Response> {
        const validation = await listTasksNotebooksSchema.safeParseAsync(
            req.query
        );

        if (!validation.success) {
            const errors = formatValidationErrors(validation.error);
            return this.clientError(res, undefined, errors);
        }

        const payload = validation.data;

        const searchProps: SearchTaskNotebookProps = {
            id: payload.id ? new Uuid(payload.id) : undefined,
            educatorId: payload.educatorId
                ? new Uuid(payload.educatorId)
                : undefined,
            category: payload.category,
            descriptionContains: payload.descriptionContains,
        };

        const result = await this.useCase.execute(searchProps);
        
        if (!result.ok) {
            return this.fail(res, result.error);
        }
        return this.ok(res, result.value);
    }
}