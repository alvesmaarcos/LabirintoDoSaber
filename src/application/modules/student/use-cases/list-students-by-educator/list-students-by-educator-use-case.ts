import { Uuid } from "@wave-telecom/framework/core";
import { StudentRepository } from "../../../../../domain/repositories/student-repository";
import { mapStudentToResponse } from "../../../../../infraestructure/mappers/map-student";

interface ListStudentsByEducatorRequest {
  educatorId: Uuid;
}

export class ListStudentsByEducatorUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(request: ListStudentsByEducatorRequest) {
    const result = await this.studentRepository.search({
      educatorId: request.educatorId,
    });
    return result.map(mapStudentToResponse);
  }
}
