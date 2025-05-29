export interface IssueInterface {
  id: number;
  name: string;
  description: string;
  openDate: string;
  closeDate: string | null;
  issueType: string;
  status: "OPEN" | "CLOSED" | "ABANDONED";
  productManager: string;
  tasksCount: number;
  doneTasksCount: number;
  result: string;
}
