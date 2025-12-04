import { BaseController } from "@wave-telecom/framework/controllers";
import { Request, Response } from "express";
import { EducatorUpdateProfilePictureUseCase } from "./educator-update-profile-picture-use-case";

export class EducatorUpdateProfilePictureController extends BaseController {
  constructor(private useCase: EducatorUpdateProfilePictureUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<Response> {
    const educatorEmail = req.user?.email;

    if (!educatorEmail) {
      return this.clientError(res, "UNAUTHORIZED");
    }

    const photo = req.file;

    if (!photo) {
      return this.clientError(res, "PROFILE_PICTURE_REQUIRED");
    }

    const result = await this.useCase.execute({
      educatorEmail,
      photo,
    });

    if (!result.ok) {
      if (result.error === "EDUCATOR_DOES_NOT_EXISTS") {
        return this.notFound(res, "EDUCATOR_DOES_NOT_EXISTS");
      }

      return this.fail(res, result.error);
    }

    return this.ok(res, result.value);
  }
}
