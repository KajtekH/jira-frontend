export interface RequestRequestInterface {
  name: string;
  description: string;
  requestType: 'PATCH' | 'MINOR' | 'MAJOR';
  accountManager: string;
}
