import { BaseController } from "@wave-telecom/framework/controllers";
import { GetEducatorProfileUseCase } from "./get-educator-profile-use-case";
import { Request, Response } from "express";

export class GetEducatorProfileController extends BaseController {
  constructor(private useCase: GetEducatorProfileUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<Response> {
    
    const educatorId = (req as any).user?.id; 

    if (!educatorId) {
      return this.unauthorized(res, "NOT_AUTHENTICATED");
    }

    
    const result = await this.useCase.execute({ educatorId });

    if (!result.ok) {
      if (result.error === "EDUCATOR_NOT_FOUND") {
        return this.notFound(res, result.error);
      }
      return this.fail(res, result.error);
    }

    return this.ok(res, result.value);
  }
}