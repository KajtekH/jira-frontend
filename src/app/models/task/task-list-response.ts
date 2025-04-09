import {TaskInterface} from "./task.interface";

export interface TaskListResponse {
  openTasks: TaskInterface[];
  inProgressTasks: TaskInterface[];
  closedTasks: TaskInterface[];
  abandonedTasks: TaskInterface[];
}
