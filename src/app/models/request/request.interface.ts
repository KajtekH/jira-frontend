export interface RequestInterface {
  id: number;
  name: string;
  description: string;
  status: "OPEN" | "CLOSED" | "ABANDONED";
  requestType: 'PATCH' | 'MINOR' | 'MAJOR';
  accountManager: string;
}
