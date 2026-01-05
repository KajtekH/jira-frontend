import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {TaskInterface} from "../../models/task/task.interface";
import {TaskRequest} from "../../models/task/taskRequest.interface";
import {MoveTaskRequest} from "../../models/task/moveTaskRequest.interface";
import {TaskListResponse} from "../../models/task/task-list-response";
import {HOST} from "../host.constant";


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = `${HOST}/tasks`;

  constructor(private http: HttpClient) { }

  getAllTasks(issueId: number): Observable<TaskListResponse> {
    return this.http.get<TaskListResponse>(`${this.baseUrl}/${issueId}`, {withCredentials: true});
  }

  addTask(taskRequest: TaskRequest, issueId: number): Observable<TaskInterface> {
    return this.http.post<TaskInterface>(`${this.baseUrl}/${issueId}`, taskRequest, {withCredentials: true});
  }

  moveTask(request: MoveTaskRequest): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}`, request, {withCredentials: true});
  }

  updateTask(task: TaskRequest, id: number): Observable<TaskInterface> {
    return this.http.put<TaskInterface>(`${this.baseUrl}/${id}`, task, {withCredentials: true});
  }
}
