import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {TaskInterface} from "../models/task.interface";
import {TaskRequest} from "../models/taskRequest.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  getTasksByStatus(status: string): Observable<TaskInterface[]> {
    return this.http.get<TaskInterface[]>(`${this.baseUrl}/${status}`);
  }

  addTask(taskRequest: TaskRequest): Observable<TaskInterface> {
    return this.http.post<TaskInterface>(this.baseUrl, taskRequest);
  }
}
