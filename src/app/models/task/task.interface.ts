export interface TaskInterface {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  type: 'QUALITY' | 'FEATURE' | 'BUG' | 'IMPROVEMENT';
  status: 'TO_DO' | 'IN_PROGRESS' | 'TESTING' | 'DONE';
  assignee: string;
  priority: number;
}
