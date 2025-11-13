import { describe, it, expect, vi, beforeEach } from "vitest";
import { EducatorRepository } from "../../../../../domain/repositories/educator-repository";
import { Educator } from "../../../../../domain/entities/educator";
import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { GetEducatorProfileUseCase } from "./get-educator-profile-use-case";


const mockEducatorRepository = (): EducatorRepository => {
  return {
    search: vi.fn(),
    getByEmail: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  } as unknown as EducatorRepository;
};

describe("GetEducatorProfileUseCase", () => {
  let educatorRepository: EducatorRepository;
  let useCase: GetEducatorProfileUseCase;

  beforeEach(() => {
    educatorRepository = mockEducatorRepository();
    useCase = new GetEducatorProfileUseCase(educatorRepository);
  });

  it("should fail if educator does not exist (empty array)", async () => {
    (educatorRepository.search as any).mockResolvedValue([]);

    const educatorId = Uuid.random(); 
    const result = await useCase.execute({ educatorId }); 

    expect(result).toEqual(failure("EDUCATOR_NOT_FOUND"));
    expect(educatorRepository.search).toHaveBeenCalledWith({ id: educatorId });
  });

  it("should return educator details if educator exists", async () => {
    const educatorId = Uuid.random(); 
    const mockEducator = Educator.create({
      id: educatorId,
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashed_password_que_nao_sera_retornado",
      createdAt: new Date(),
    });

    (educatorRepository.search as any).mockResolvedValue([mockEducator]);

    const result = await useCase.execute({ educatorId: educatorId }); 

    const expectedDetails = {
      id: educatorId.toString(),
      name: "Jane Doe",
      email: "jane@example.com",
    };

    expect(result).toEqual(success(expectedDetails));
    expect(educatorRepository.search).toHaveBeenCalledWith({ id: educatorId });
  });

  
});