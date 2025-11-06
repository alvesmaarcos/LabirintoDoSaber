import { Uuid } from "@wave-telecom/framework/core";
import {
  TaskNotebook,
  TaskNotebookCategory,
} from "../../../domain/entities/task-notebook";
import {
  SearchTaskNotebookProps,
  TaskNotebookRepository,
} from "../../../domain/repositories/task-notebook-repository";

export class MockTaskNotebookRepository implements TaskNotebookRepository {
  private data: TaskNotebook[] = [];

  async save(taskNotebook: TaskNotebook): Promise<TaskNotebook> {
    const index = this.data.findIndex((t) => t.id === taskNotebook.id);
    if (index >= 0) {
      this.data[index] = taskNotebook;
    } else {
      this.data.push(taskNotebook);
    }
    return taskNotebook;
  }

  async getById(id: Uuid): Promise<TaskNotebook | null> {
    const notebook = this.data.find((t) => t.id === id);
    if (!notebook) return null;

    const result = TaskNotebook.create({
      id: notebook.id,
      educator: notebook.educator,
      tasks: [...notebook.tasks],
      createdAt: notebook.createdAt,
      category: TaskNotebookCategory.Reading,
    });
    if (!result.ok) {
      return null;
    }
    return result.value;
  }

  async search(props: SearchTaskNotebookProps): Promise<TaskNotebook[]> {
    return this.data.filter((notebook) => {
      if (props.id && notebook.id !== props.id) return false;
      if (props.educatorId && notebook.educator.id !== props.educatorId)
        return false;
      if (
        props.category &&
        "category" in notebook &&
        notebook.category !== props.category
      )
        return false;
      return true;
    });
  }

  async delete(id: Uuid): Promise<void> {
    this.data = this.data.filter((n) => n.id !== id);
  }
}
