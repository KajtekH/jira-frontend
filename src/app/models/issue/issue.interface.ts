export interface IssueInterface {
  id: number;
  name: string;
  description: string;
  openDate: string;
  closeDate: string | null;
  status: "OPEN" | "CLOSED" | "ABANDONED";
  productManager: string;
  tasksCount: number;
  doneTasksCount: number;
}
