import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskListComponent} from "./components/task-list/task-list.component";
import {IssueListComponent} from "./components/issue-list/issue-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent, IssueListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Jira-like-app';
}
