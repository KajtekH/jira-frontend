import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IssueInterface} from "../../models/issue/issue.interface";
import {IssueRequestInterface} from "../../models/issue/issueRequest.interface";

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private baseUrl = 'http://localhost:8080/api/issues';
  constructor(private http: HttpClient) { }

  getIssues(requestId: number): Observable<IssueInterface[]> {
    return this.http.get<IssueInterface[]>(`${this.baseUrl}/${requestId}`, {withCredentials: true});
  }

  getIssueById(issueId: number): Observable<IssueInterface> {
    return this.http.get<IssueInterface>(`${this.baseUrl}/issue/${issueId}`, {withCredentials: true});
  }

  abandonIssue(issueId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${issueId}/ABANDONED`,{}, {withCredentials: true});
  }

  closeIssue(issueId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${issueId}/CLOSED`,{}, {withCredentials: true});
  }

  addIssue(issue: IssueRequestInterface, requestId: number): Observable<IssueInterface> {
    return this.http.post<IssueInterface>(`${this.baseUrl}/${requestId}`, issue, {withCredentials: true});
  }

}
