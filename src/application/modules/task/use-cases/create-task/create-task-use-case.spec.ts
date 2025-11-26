import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import { TaskCategory, TaskType } from "../../../../../domain/entities/task";
import { CreateTaskUseCase } from "./create-task-use-case";
import { success, failure } from "@wave-telecom/framework/core";
import { FileStorage } from "../../../../services/file-storage";

// Mock do repositório

const mockFileStorage = () =>
  ({
    saveFile: vi.fn().mockResolvedValue({ url: "http://mockurl.com/file" }),
  } as any);

const mockImageFile: Express.Multer.File = {
  fieldname: "imageFile",
  originalname: "image.png",
  encoding: "7bit",
  mimetype: "image/png",
  buffer: Buffer.from("fake image buffer"),
  size: 1234,
} as any;

const mockTaskRepository = (): TaskRepository => {
  return {
    save: vi.fn(),
    getById: vi.fn(),
    search: vi.fn(),
    delete: vi.fn(),
  } as unknown as TaskRepository;
};

describe("CreateTaskUseCase", () => {
  let taskRepository: TaskRepository;
  let useCase: CreateTaskUseCase;
  let fileStorage: FileStorage;
  beforeEach(() => {
    taskRepository = mockTaskRepository();
    fileStorage = mockFileStorage();
    useCase = new CreateTaskUseCase(taskRepository, fileStorage);
  });

  it("should fail if MultipleChoice task has media", async () => {
    const result = await useCase.execute({
      category: TaskCategory.Reading,
      type: TaskType.MultipleChoice,
      prompt: "Qual é a capital da França?",
      alternatives: [
        { text: "Paris", isCorrect: true },
        { text: "Londres", isCorrect: false },
      ],
      imageFile: mockImageFile,
    });

    expect(result).toEqual(failure("TEXT_TASK_CANNOT_HAVE_MEDIA"));
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it("should fail if MultipleChoiceWithMedia task has no media", async () => {
    const result = await useCase.execute({
      category: TaskCategory.Reading,
      type: TaskType.MultipleChoiceWithMedia,
      prompt: "Qual é a capital da França?",
      alternatives: [
        { text: "Paris", isCorrect: true },
        { text: "Londres", isCorrect: false },
      ],
    });

    expect(result).toEqual(failure("MEDIA_TASK_REQUIRES_IMAGE_OR_AUDIO"));
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it("should fail if no correct alternative is provided", async () => {
    const result = await useCase.execute({
      category: TaskCategory.Reading,
      type: TaskType.MultipleChoice,
      prompt: "Qual é a capital da França?",
      alternatives: [
        { text: "Paris", isCorrect: false },
        { text: "Londres", isCorrect: false },
      ],
    });

    expect(result).toEqual(failure("AT_LEAST_ONE_ALTERNATIVE_MUST_BE_CORRECT"));
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it("should create a valid MultipleChoice task successfully", async () => {
    const payload = {
      category: TaskCategory.Reading,
      type: TaskType.MultipleChoice,
      prompt: "Qual é a capital da França?",
      alternatives: [
        { text: "Paris", isCorrect: true },
        { text: "Londres", isCorrect: false },
      ],
    };

    const result = await useCase.execute(payload);

    expect(result).toEqual(success(void 0));
    expect(taskRepository.save).toHaveBeenCalled();
    const savedTask = (taskRepository.save as any).mock.calls[0][0];
    expect(savedTask.prompt).toBe(payload.prompt);
    expect(savedTask.type).toBe(payload.type);
  });

  it("should create a valid MultipleChoiceWithMedia task successfully", async () => {
    const payload = {
      category: TaskCategory.Reading,
      type: TaskType.MultipleChoiceWithMedia,
      prompt: "Qual é a capital da França?",
      alternatives: [
        { text: "Paris", isCorrect: true },
        { text: "Londres", isCorrect: false },
      ],
      imageFile: mockImageFile,
    };

    const result = await useCase.execute(payload);

    expect(result).toEqual(success(void 0));
    expect(taskRepository.save).toHaveBeenCalled();
    const savedTask = (taskRepository.save as any).mock.calls[0][0];
    expect(savedTask.prompt).toBe(payload.prompt);
    expect(savedTask.type).toBe(payload.type);
    expect(savedTask.imageFile).toBe("http://mockurl.com/file");
  });
});
