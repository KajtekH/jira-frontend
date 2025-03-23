export interface MoveTaskRequest{
  taskId: number;
  status: 'TO_DO' | 'IN_PROGRESS' | 'TESTING' | 'DONE';
}
