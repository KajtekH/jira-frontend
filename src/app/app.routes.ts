import { Routes } from '@angular/router';
import {IssueListComponent} from "./components/issue-list/issue-list.component";
import {TaskListComponent} from "./components/task-list/task-list.component";
import {RequestListComponent} from "./components/request-list/request-list.component";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {LoginComponent} from "./components/login-component/login.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  { path: 'product-list', component: ProductListComponent },
  { path: 'issue-list/:id', component: IssueListComponent },
  { path: 'task-list/:id', component: TaskListComponent },
  { path: 'request-list/:id', component: RequestListComponent }
];
