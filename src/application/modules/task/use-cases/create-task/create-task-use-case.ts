import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { TaskRepository } from "../../../../../domain/repositories/task-repository";
import {
  Task,
  TaskCategory,
  TaskType,
} from "../../../../../domain/entities/task";
import { FileStorage } from "../../../../services/file-storage";

interface CreateTaskUseCaseRequest {
  category: TaskCategory;
  type: TaskType;
  prompt: string;
  alternatives: {
    text: string;
    isCorrect: boolean;
  }[];
  imageFile?: Express.Multer.File;
  audioFile?: Express.Multer.File;
}

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private fileStorage: FileStorage
  ) {}

  async execute(props: CreateTaskUseCaseRequest) {
    if (!Object.values(TaskType).includes(props.type)) {
      return failure("INVALID_TASK_TYPE");
    }

    if (
      props.type === TaskType.MultipleChoice &&
      (props.imageFile || props.audioFile)
    ) {
      return failure("TEXT_TASK_CANNOT_HAVE_MEDIA");
    }
    if (props.type === TaskType.MultipleChoiceWithMedia) {
      const hasImage = !!props.imageFile;
      const hasAudio = !!props.audioFile;
      if (!hasImage && !hasAudio) {
        return failure("MEDIA_TASK_REQUIRES_IMAGE_OR_AUDIO");
      }
    }

    const hasCorrectAlternative = props.alternatives.some(
      (alt) => alt.isCorrect === true
    );

    if (!hasCorrectAlternative) {
      return failure("AT_LEAST_ONE_ALTERNATIVE_MUST_BE_CORRECT");
    }
    const id = Uuid.random();
    let audioUrl: string | undefined;
    if (props.audioFile) {
      const audioSaveResult = await this.fileStorage.saveFile({
        taskId: id.value,
        file: props.audioFile,
      });
      audioUrl = audioSaveResult.url;
    }

    let imageUrl: string | undefined;
    if (props.imageFile) {
      const imageSaveResult = await this.fileStorage.saveFile({
        taskId: id.value,
        file: props.imageFile,
      });
      imageUrl = imageSaveResult.url;
    }

    const taskResult = Task.create({
      id: id,
      category: props.category,
      type: props.type,
      prompt: props.prompt,
      alternatives: props.alternatives,
      audioFile: audioUrl,
      imageFile: imageUrl,
    });
    if (!taskResult.ok) {
      return failure("INVALID_TASK_DATA");
    }
    const task = taskResult.value;

    await this.taskRepository.save(task);

    return success(void 0);
  }
}
