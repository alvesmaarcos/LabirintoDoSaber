import { BaseController } from "@wave-telecom/framework/controllers";
import { GetEducatorLastSessionsUseCase } from "./get-educator-last-sessions-use-case";
import { Request, Response } from "express";

export class GetEducatorLastSessionsController extends BaseController {
  constructor(private useCase: GetEducatorLastSessionsUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<Response> {
    const user = req.user;

    if (!user) {
      return this.forbidden(res, "UNAUTHORIZED");
    }
    const result = await this.useCase.execute({ educatorEmail: user.email });

    if (!result.ok) {
      if (result.error === "EDUCATOR_NOT_FOUND") {
        return this.notFound(res, result.error);
      }
      if (result.error === "EDUCATOR_DOES_NOT_HAVE_SESSIONS") {
        return this.notFound(res, result.error);
      }
      return this.fail(res, "INTERNAL_ERROR");
    }

    return this.ok(res, result.value);
  }
}
