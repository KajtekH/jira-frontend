import { Routes } from '@angular/router';
import {IssueListComponent} from "./components/issue-list/issue-list.component";
import {TaskListComponent} from "./components/task-list/task-list.component";

export const routes: Routes = [
  { path: '', redirectTo: '/issue-list', pathMatch: 'full' },
  { path: 'issue-list', component: IssueListComponent },
  { path: 'task-list/:id', component: TaskListComponent }
];
