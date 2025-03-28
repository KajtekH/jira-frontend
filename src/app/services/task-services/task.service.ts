import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {TaskInterface} from "../../models/task/task.interface";
import {TaskRequest} from "../../models/task/taskRequest.interface";
import {MoveTaskRequest} from "../../models/task/moveTaskRequest.interface";


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  getTasksByStatus(issueId: number, status: string): Observable<TaskInterface[]> {
    return this.http.get<TaskInterface[]>(`${this.baseUrl}/${issueId}/${status}`);
  }

  addTask(taskRequest: TaskRequest, issueId: number): Observable<TaskInterface> {
    return this.http.post<TaskInterface>(`${this.baseUrl}/${issueId}`, taskRequest);
  }

  moveTask(request: MoveTaskRequest): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}`, request);
  }
}
