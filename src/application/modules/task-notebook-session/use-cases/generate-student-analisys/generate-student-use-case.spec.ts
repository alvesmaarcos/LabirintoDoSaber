import { describe, it, expect, vi, beforeEach } from "vitest";
import { failure, success, Uuid } from "@wave-telecom/framework/core";

import { TaskCategory } from "../../../../../domain/entities/task";
import { StudentRepository } from "../../../../../domain/repositories/student-repository";
import { TaskNotebookSessionRepository } from "../../../../../domain/repositories/task-notebook-session-repository";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import { GenerateStudentAnalysisUseCase } from "./generate-student-analisys-use-case";

// IDs fixos
const ID = {
  student: Uuid.random().value,
  session1: Uuid.random().value,
  session2: Uuid.random().value,
  t1: Uuid.random().value,
  t2: Uuid.random().value,
  t3: Uuid.random().value,
  missing: Uuid.random().value,
};

// Factories --------------------------------------------------

// cria student minimal (só id é usado no use case)
const makeStudent = (studentId: string) => ({
  id: new Uuid(studentId),
});

// cria uma sessão com lista de answers (cada answer tem taskId: Uuid, isCorrect: boolean)
const makeSession = (
  answers: Array<{ taskId: string; isCorrect: boolean }>
) => ({
  answers: answers.map((a) => ({
    taskId: new Uuid(a.taskId),
    selectedAlternativeId: Uuid.random(), // não utilizado no use case, só pra formato
    isCorrect: a.isCorrect,
    timeToAnswer: 1,
    answeredAt: new Date(),
  })),
});

// cria objeto Task com category
const makeTask = (taskId: string, category: TaskCategory) => ({
  id: new Uuid(taskId),
  category,
});

// Repositórios mockados (mesmo estilo dos seus outros testes) ----------
const mockStudentRepository = (): StudentRepository =>
  ({
    getById: vi.fn(),
  } as unknown as StudentRepository);

const mockSessionRepository = (): TaskNotebookSessionRepository =>
  ({
    listByStudentId: vi.fn(),
  } as unknown as TaskNotebookSessionRepository);

const mockTaskRepository = (): TaskRepository =>
  ({
    getById: vi.fn(),
  } as unknown as TaskRepository);

// Tests ------------------------------------------------------
describe("GenerateStudentAnalysisUseCase", () => {
  let studentRepo: StudentRepository;
  let sessionRepo: TaskNotebookSessionRepository;
  let taskRepo: TaskRepository;
  let useCase: GenerateStudentAnalysisUseCase;

  beforeEach(() => {
    studentRepo = mockStudentRepository();
    sessionRepo = mockSessionRepository();
    taskRepo = mockTaskRepository();

    useCase = new GenerateStudentAnalysisUseCase(
      studentRepo,
      sessionRepo,
      taskRepo
    );
  });

  it("should fail if student is not found", async () => {
    (studentRepo.getById as any).mockResolvedValue(null);

    const result = await useCase.execute({ studentId: ID.student });

    expect(result).toEqual(failure("STUDENT_NOT_FOUND"));
  });

  it("should return zeros when student has no sessions", async () => {
    (studentRepo.getById as any).mockResolvedValue(makeStudent(ID.student));
    (sessionRepo.listByStudentId as any).mockResolvedValue([]);

    const result = await useCase.execute({ studentId: ID.student });

    // success wrapper
    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected result to be ok");
    }

    const value = result.value;

    expect(value.total.total).toBe(0);
    expect(value.total.correct).toBe(0);
    expect(value.total.accuracy).toBe(0);

    expect(value.categories.reading.total).toBe(0);
    expect(value.categories.writing.total).toBe(0);
    expect(value.categories.vocabulary.total).toBe(0);
    expect(value.categories.comprehension.total).toBe(0);
  });

  it("should calculate accuracy correctly per category and total", async () => {
    (studentRepo.getById as any).mockResolvedValue(makeStudent(ID.student));

    const session = makeSession([
      { taskId: ID.t1, isCorrect: true }, // reading
      { taskId: ID.t2, isCorrect: false }, // reading
      { taskId: ID.t3, isCorrect: true }, // writing
    ]);

    (sessionRepo.listByStudentId as any).mockResolvedValue([session]);

    (taskRepo.getById as any).mockImplementation((taskId: Uuid | any) => {
      const id = (taskId as any).value ?? (taskId as any);
      if (id === ID.t1) return makeTask(ID.t1, TaskCategory.Reading);
      if (id === ID.t2) return makeTask(ID.t2, TaskCategory.Reading);
      if (id === ID.t3) return makeTask(ID.t3, TaskCategory.Writing);
      return null;
    });

    const result = await useCase.execute({ studentId: ID.student });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected result to be ok");
    }
    const { categories, total } = result.value;

    // reading: 2 answered, 1 correct => 0.5
    expect(categories.reading.total).toBe(2);
    expect(categories.reading.correct).toBe(1);
    expect(categories.reading.accuracy).toBe(0.5);

    // writing: 1 answered, 1 correct => 1
    expect(categories.writing.total).toBe(1);
    expect(categories.writing.correct).toBe(1);
    expect(categories.writing.accuracy).toBe(1);

    // totals
    expect(total.total).toBe(3);
    expect(total.correct).toBe(2);
    expect(total.accuracy).toBeCloseTo(2 / 3);
  });

  it("should ignore answers whose tasks do not exist", async () => {
    (studentRepo.getById as any).mockResolvedValue(makeStudent(ID.student));

    const session = makeSession([
      { taskId: ID.t1, isCorrect: true }, // exists
      { taskId: ID.missing, isCorrect: true }, // missing => should be ignored
    ]);

    (sessionRepo.listByStudentId as any).mockResolvedValue([session]);

    (taskRepo.getById as any).mockImplementation((taskId: Uuid | any) => {
      const id = (taskId as any).value ?? (taskId as any);
      if (id === ID.t1) return makeTask(ID.t1, TaskCategory.Vocabulary);
      return null;
    });

    const result = await useCase.execute({ studentId: ID.student });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected result to be ok");
    }
    const { categories, total } = result.value;

    expect(categories.vocabulary.total).toBe(1);
    expect(categories.vocabulary.correct).toBe(1);

    expect(total.total).toBe(1);
    expect(total.correct).toBe(1);
  });

  it("should sum multiple sessions correctly", async () => {
    (studentRepo.getById as any).mockResolvedValue(makeStudent(ID.student));

    const session1 = makeSession([{ taskId: ID.t1, isCorrect: true }]); // reading
    const session2 = makeSession([
      { taskId: ID.t2, isCorrect: false }, // reading
      { taskId: ID.t3, isCorrect: true }, // comprehension
    ]);

    (sessionRepo.listByStudentId as any).mockResolvedValue([
      session1,
      session2,
    ]);

    (taskRepo.getById as any).mockImplementation((taskId: Uuid | any) => {
      const id = (taskId as any).value ?? (taskId as any);
      if (id === ID.t1 || id === ID.t2)
        return makeTask(id, TaskCategory.Reading);
      if (id === ID.t3) return makeTask(id, TaskCategory.Comprehension);
      return null;
    });

    const result = await useCase.execute({ studentId: ID.student });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("Expected result to be ok");
    }
    const { categories, total } = result.value;

    expect(categories.reading.total).toBe(2);
    expect(categories.reading.correct).toBe(1);

    expect(categories.comprehension.total).toBe(1);
    expect(categories.comprehension.correct).toBe(1);

    expect(total.total).toBe(3);
    expect(total.correct).toBe(2);
  });
});
