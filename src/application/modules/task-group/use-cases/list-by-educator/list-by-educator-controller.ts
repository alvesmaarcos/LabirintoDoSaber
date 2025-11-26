import { BaseController } from "@wave-telecom/framework/controllers";
import { ListByEducatorUseCase } from "./list-by-educator-use-case";
import { Request, Response } from "express";

export class ListByEducatorController extends BaseController {
  constructor(private useCase: ListByEducatorUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<unknown> {
    const user = req.user;
    if (!user) {
      return this.unauthorized(res);
    }
    const taskGroups = await this.useCase.execute(user.id);
    return this.ok(res, taskGroups);
  }
}
