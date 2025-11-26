import { failure, success, Uuid } from "@wave-telecom/framework/core";
import { Task } from "./task";
import { Educator } from "./educator";

export enum TaskNotebookCategory {
  Reading = "reading",
  Writing = "writing",
  Vocabulary = "vocabulary",
  Comprehension = "comprehension",
}

export interface CreateTaskNotebookProps {
  id?: Uuid;
  educator: Educator;
  tasks?: Task[];
  category: TaskNotebookCategory;
  createdAt?: Date;
  description: string;
  taskGroupsIds?: string[];
}

export class TaskNotebook {
  private constructor(
    public readonly id: Uuid,
    public readonly educator: Educator,
    public readonly tasks: Task[],
    public readonly category: TaskNotebookCategory,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly taskGroupsIds: string[]
  ) {}

  static create(props: CreateTaskNotebookProps) {
    try {
      const notebook = new TaskNotebook(
        props.id || Uuid.random(),
        props.educator,
        props.tasks || [],
        props.category,
        props.description,
        props.createdAt || new Date(),
        props.taskGroupsIds || []
      );
      return success(notebook);
    } catch (error) {
      return failure(void 0);
    }
  }

  public addTask(task: Task) {
    const exists = this.tasks.some((t) => t.id === task.id);
    if (exists) {
      return failure("TASK_ALREADY_EXISTS");
    }

    const updatedTasks = [...this.tasks, task];
    const updatedNotebook = new TaskNotebook(
      this.id,
      this.educator,
      updatedTasks,
      TaskNotebookCategory.Comprehension,
      this.description,
      this.createdAt,
      this.taskGroupsIds
    );

    return success(updatedNotebook);
  }

  public listTasks() {
    return success(this.tasks);
  }
}
