import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterEducatorUseCase } from "./register-educator-use-case";
import { EducatorRepository } from "../../../../../domain/repositories/educator-repository";
import { success, failure } from "@wave-telecom/framework/core";

// Mock do repositório
const mockEducatorRepository = (): EducatorRepository =>
  ({
    getByEmail: vi.fn(),
    save: vi.fn(),
  } as unknown as EducatorRepository);

describe("RegisterEducatorUseCase", () => {
  let educatorRepository: EducatorRepository;
  let useCase: RegisterEducatorUseCase;

  beforeEach(() => {
    educatorRepository = mockEducatorRepository();
    useCase = new RegisterEducatorUseCase(educatorRepository);
  });

  it("should fail if educator already exists", async () => {
    (educatorRepository.getByEmail as any).mockResolvedValue({
      id: "123",
      name: "Jane Doe",
      email: "jane@example.com",
    });

    const result = await useCase.execute({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(result).toEqual(failure("EDUCATOR_ALREADY_EXISTS"));
    expect(educatorRepository.save).not.toHaveBeenCalled();
  });

  it("should register educator successfully", async () => {
    (educatorRepository.getByEmail as any).mockResolvedValue(null);

    const result = await useCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "mypassword",
    });

    expect(result.ok).toBe(true);

    // captura o Educator real salvo
    const savedEducator = (educatorRepository.save as any).mock.calls[0][0];

    if (result.ok) {
      expect(result.value).toEqual({
        id: savedEducator.id, // agora verifica o ID exato
        name: "John Doe",
      });
    }

    expect(educatorRepository.save).toHaveBeenCalledTimes(1);

    expect(savedEducator.name).toBe("John Doe");
    expect(savedEducator.email).toBe("john@example.com");
    expect(savedEducator.password).not.toBe("mypassword");
  });

});
