import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {TaskListComponent} from "./components/task-list/task-list.component";
import {IssueListComponent} from "./components/issue-list/issue-list.component";
import {AuthService} from "./services/auth-services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent, IssueListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Jira-like-app';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/login')) {
          this.authService.stopTokenRefresh();
        } else {
          this.authService.startTokenRefresh();
        }
      }
    });
  }
}
