import { describe, it, expect, vi, beforeEach } from "vitest";
import { Uuid, success, failure } from "@wave-telecom/framework/core";
import { TaskGroupRepository } from "../../../../../domain/repositories/task-group-repository";
import { DeleteTaskGroupUseCase } from "./delete-task-group-use-case";

// 1. Mock do Repositório (Ajustado para TaskGroupRepository)
// Assumindo que TaskGroupRepository tem, no mínimo, findById e deleteById
const mockTaskGroupRepository = () => {
  return {
    findById: vi.fn(),
    deleteById: vi.fn(),
    // Adicione outros métodos se forem necessários para a interface
    save: vi.fn(),
    search: vi.fn(),
  } as unknown as TaskGroupRepository;
};

// Dados de Teste
const validTaskGroupId = Uuid.random();
const invalidIdString = "not-a-valid-uuid";
const mockTaskGroup = { id: validTaskGroupId, name: "Grupo Teste" }; // Mock simplificado da entidade

describe("DeleteTaskGroupUseCase", () => {
  let taskGroupRepository: TaskGroupRepository;
  let useCase: DeleteTaskGroupUseCase;

  beforeEach(() => {
    // Resetar mocks antes de cada teste
    taskGroupRepository = mockTaskGroupRepository();
    useCase = new DeleteTaskGroupUseCase(taskGroupRepository);

    // Configuração padrão para o sucesso (facilitar testes)
    (taskGroupRepository.findById as any).mockResolvedValue(mockTaskGroup);
    (taskGroupRepository.deleteById as any).mockResolvedValue(undefined);
  });

  // --- CENÁRIOS DE SUCESSO ---

  it("should successfully delete an existing task group", async () => {
    const result = await useCase.execute({
      taskGroupId: validTaskGroupId,
    });

    expect(result).toEqual(success(null));
    // Deve buscar o grupo para verificar a existência
    expect(taskGroupRepository.findById).toHaveBeenCalledWith(validTaskGroupId);
    // Deve chamar a função de exclusão
    expect(taskGroupRepository.deleteById).toHaveBeenCalledWith(
      validTaskGroupId
    );
  });

  // --- CENÁRIOS DE FALHA (VALIDAÇÃO E PRÉ-CONDIÇÕES) ---

  it("should return failure if taskGroupId is missing (validation 1)", async () => {
    // Note: O Controller já deve garantir isso, mas o Use Case se protege.
    // Simulação passando 'null' como Uuid para acionar o primeiro 'if'
    const result = await useCase.execute({ taskGroupId: null as any });

    expect(result).toEqual(failure("TASK_GROUP_ID_REQUIRED"));
    expect(taskGroupRepository.findById).not.toHaveBeenCalled();
    expect(taskGroupRepository.deleteById).not.toHaveBeenCalled();
  });

  it("should return failure if taskGroupId is invalid (validation 2)", async () => {
    // Simulação de um Uuid inválido (embora o Controller deva evitar isso)
    // Para testar a lógica do Use Case que chama Uuid.isValid
    const invalidUuidObject = { toString: () => invalidIdString } as Uuid;

    // Garante que o Uuid.isValid será chamado e falhará com essa entrada
    vi.spyOn(Uuid, "isValid").mockReturnValue(false);

    const result = await useCase.execute({
      taskGroupId: invalidUuidObject,
    });

    expect(result).toEqual(failure("INVALID_TASK_GROUP_ID"));
    expect(Uuid.isValid).toHaveBeenCalledWith(invalidIdString);
    expect(taskGroupRepository.findById).not.toHaveBeenCalled();

    // Restaurar o mock após o teste
    (Uuid.isValid as any).mockRestore();
  });

  it("should return failure if the task group is not found", async () => {
    // Configurar o mock para retornar null, simulando 'não encontrado'
    (taskGroupRepository.findById as any).mockResolvedValue(null);

    const result = await useCase.execute({
      taskGroupId: validTaskGroupId,
    });

    expect(result).toEqual(failure("TASK_GROUP_NOT_FOUND"));
    expect(taskGroupRepository.findById).toHaveBeenCalledWith(validTaskGroupId);
    // A exclusão NÃO deve ser chamada
    expect(taskGroupRepository.deleteById).not.toHaveBeenCalled();
  });

  // --- CENÁRIOS DE FALHA (INFRAESTRUTURA/EXCEÇÃO) ---

  it("should return failure if the repository throws an error during findById", async () => {
    const repoError = new Error("Database connection failed during find");
    // Simular falha na primeira chamada ao banco (findById)
    (taskGroupRepository.findById as any).mockRejectedValue(repoError);

    const result = await useCase.execute({
      taskGroupId: validTaskGroupId,
    });

    // Deve cair no catch e retornar a falha genérica
    expect(result).toEqual(failure("DELETE_TASK_GROUP_FAILED"));
    expect(taskGroupRepository.findById).toHaveBeenCalled();
    expect(taskGroupRepository.deleteById).not.toHaveBeenCalled();
  });

  it("should return failure if the repository throws an error during deleteById", async () => {
    const repoError = new Error("Database error during deletion");
    // findById deve retornar sucesso
    (taskGroupRepository.findById as any).mockResolvedValue(mockTaskGroup);
    // Simular falha na segunda chamada ao banco (deleteById)
    (taskGroupRepository.deleteById as any).mockRejectedValue(repoError);

    const result = await useCase.execute({
      taskGroupId: validTaskGroupId,
    });

    // Deve cair no catch e retornar a falha genérica
    expect(result).toEqual(failure("DELETE_TASK_GROUP_FAILED"));
    expect(taskGroupRepository.findById).toHaveBeenCalled();
    expect(taskGroupRepository.deleteById).toHaveBeenCalled();
  });
});