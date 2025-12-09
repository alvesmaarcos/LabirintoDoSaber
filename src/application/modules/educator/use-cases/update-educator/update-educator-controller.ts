import {
  BaseController,
  formatValidationErrors,
} from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { UpdateEducatorUseCase } from "./update-educator-use-case";
import { updateEducatorSchema } from "../../schemas/update-educator-schema";

export class UpdateEducatorController extends BaseController {
  constructor(private useCase: UpdateEducatorUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    if (!user) {
      return this.unauthorized(res);
    }

    const validation = await updateEducatorSchema.safeParseAsync({
      ...req.body,
      email: user.email,
    });

    if (!validation.success) {
      const errors = formatValidationErrors(validation.error);
      return this.clientError(res, undefined, errors);
    }

    const payload = validation.data;

    const result = await this.useCase.execute(payload);

    if (!result.ok) {
      if (result.error === "EDUCATOR_NOT_FOUND") {
        return this.notFound(res, result.error);
      }
      return this.fail(res, result.error);
    }

    return this.ok(res, result.value);
  }
}
