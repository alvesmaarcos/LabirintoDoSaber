import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTaskGroupUseCase } from "./update-task-group-use-case";
import { success, failure, Uuid } from "@wave-telecom/framework/core";

// Mock do Repositório
const mockRepo = {
  findById: vi.fn(), // Nome do método usado no Use Case
  save: vi.fn(),
};

// Dados de Mock
const validId = Uuid.random().toString();
const validUpdateProps = { id: validId, name: "Novo Nome", educatorId: Uuid.random().toString() };
const invalidIdProps = { id: "id-invalido" };

describe("UpdateTaskGroupUseCase", () => {
  let useCase: UpdateTaskGroupUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateTaskGroupUseCase(mockRepo as any);
  });

  // --- CENÁRIOS DE VALIDAÇÃO DE PRÉ-CONDIÇÕES ---

  it("deve retornar erro se o ID for inválido", async () => {
    const result = await useCase.execute(invalidIdProps as any);
    expect(result).toEqual(failure("INVALID_TASK_GROUP_ID"));
    expect(mockRepo.findById).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o grupo de tarefas não for encontrado", async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(validUpdateProps);

    // O Use Case tenta buscar no repositório
    expect(mockRepo.findById).toHaveBeenCalled();
    expect(result).toEqual(failure("TASK_GROUP_NOT_FOUND"));
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  // --- CENÁRIOS DE FALHA DE DOMÍNIO ---

  it("deve retornar erro se updateTaskGroup falhar (falha de domínio)", async () => {
    // 1. Simular uma Entidade que falha ao tentar atualizar
    const fakeTaskGroup = {
      // O método da Entidade deve retornar um failure
      updateTaskGroup: vi.fn().mockReturnValue(failure("INVALID_TASK_GROUP_DATA")),
    };

    mockRepo.findById.mockResolvedValue(fakeTaskGroup);

    const result = await useCase.execute(validUpdateProps);

    // 2. Deve ter chamado o método de atualização
    expect(fakeTaskGroup.updateTaskGroup).toHaveBeenCalledWith(validUpdateProps);
    
    // 3. Deve retornar o erro de domínio
    expect(result).toEqual(failure("INVALID_TASK_GROUP_DATA"));
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  // --- CENÁRIOS DE SUCESSO ---

  it("deve atualizar o grupo de tarefas com sucesso", async () => {
    // 1. O objeto atualizado que o método da Entidade retorna
    const updatedTaskGroup = { id: validId, name: "Novo Nome", tasksIds: ["task-a"], educatorId: Uuid.random() };

    // 2. Simular uma Entidade que atualiza com sucesso
    const fakeTaskGroup = {
      // O método da Entidade deve retornar sucesso com o objeto atualizado
      updateTaskGroup: vi.fn().mockReturnValue(success(updatedTaskGroup)),
    };

    mockRepo.findById.mockResolvedValue(fakeTaskGroup);
    mockRepo.save.mockResolvedValue(void 0); // Simular salvamento bem-sucedido

    const result = await useCase.execute(validUpdateProps);

    // 3. Verifica se a lógica de atualização foi chamada
    expect(fakeTaskGroup.updateTaskGroup).toHaveBeenCalledWith(validUpdateProps);
    
    // 4. Verifica se o repositório salvou o objeto retornado (o desempacotado)
    expect(mockRepo.save).toHaveBeenCalledWith(updatedTaskGroup);
    
    // 5. Verifica o sucesso
    expect(result).toEqual(success(void 0));
  });

  // --- CENÁRIOS DE FALHA DE INFRAESTRUTURA (TRY...CATCH) ---
  
  it("deve retornar erro genérico se a infraestrutura falhar durante a busca", async () => {
    // Simular que a busca falhou
    mockRepo.findById.mockRejectedValue(new Error("Database connection error"));

    // O Use Case deve ter um try...catch para retornar a falha genérica
    const result = await useCase.execute(validUpdateProps);
    
    expect(result).toEqual(failure("UPDATE_TASK_GROUP_FAILED"));
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
  
  it("deve retornar erro genérico se a infraestrutura falhar durante o salvamento", async () => {
    const updatedTaskGroup = { id: validId, name: "Novo Nome" };
    const fakeTaskGroup = {
      updateTaskGroup: vi.fn().mockReturnValue(success(updatedTaskGroup)),
    };
    
    mockRepo.findById.mockResolvedValue(fakeTaskGroup);
    // Simular que o salvamento falhou
    mockRepo.save.mockRejectedValue(new Error("Network timeout"));

    const result = await useCase.execute(validUpdateProps);
    
    expect(result).toEqual(failure("UPDATE_TASK_GROUP_FAILED"));
    expect(mockRepo.save).toHaveBeenCalled();
  });
});