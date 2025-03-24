export interface MoveTaskRequest{
  taskId: number;
  taskStatus: 'TO_DO' | 'IN_PROGRESS' | 'TESTING' | 'DONE';
}
