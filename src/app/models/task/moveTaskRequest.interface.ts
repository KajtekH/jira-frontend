export interface MoveTaskRequest{
  taskId: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'ABANDONED' | 'CLOSED';
}
