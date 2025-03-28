import { Routes } from '@angular/router';
import {IssueListComponent} from "./components/issue-list/issue-list.component";
import {TaskListComponent} from "./components/task-list/task-list.component";
import {RequestListComponent} from "./components/request-list/request-list.component";

export const routes: Routes = [
  { path: '', redirectTo: '/request-list', pathMatch: 'full' },
  { path: 'issue-list/:id', component: IssueListComponent },
  { path: 'task-list/:id', component: TaskListComponent },
  { path: 'request-list', component: RequestListComponent }
];
