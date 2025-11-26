import { Uuid } from "@wave-telecom/framework/core";
import { TaskCategory } from "./task";

export interface CreateTaskGroupProps {
  id?: Uuid;
  name: string;
  tasksId?: string[];
  educatorId: Uuid;
  category: TaskCategory;
}

export class TaskGroup {
  constructor(
    readonly id: Uuid,
    readonly name: string,
    readonly tasksIds: string[],
    readonly educatorId: Uuid,
    readonly category: TaskCategory
  ) {}

  static create(props: CreateTaskGroupProps) {
    const id = props.id ?? Uuid.random();
    return new TaskGroup(
      id,
      props.name,
      props.tasksId ?? [],
      props.educatorId,
      props.category
    );
  }
}
