import { Routes } from '@angular/router';

// Lazy loading standalone components zmniejsza initial bundle size
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login-component/login.component').then(m => m.LoginComponent) },
  { path: 'product-list', loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'issue-list/:id', loadComponent: () => import('./components/issue-list/issue-list.component').then(m => m.IssueListComponent) },
  { path: 'task-list/:id', loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent) },
  { path: 'request-list/:id', loadComponent: () => import('./components/request-list/request-list.component').then(m => m.RequestListComponent) },
  { path: 'user-list', loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent) },
  { path: '**', redirectTo: 'login' }
];
