import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IssueInterface} from "../../models/issue/issue.interface";
import {IssueRequestInterface} from "../../models/issue/issueRequest.interface";
import {HOST} from "../host.constant";

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private baseUrl = `${HOST}/issues`;
  constructor(private http: HttpClient) { }

  getIssues(requestId: number): Observable<IssueInterface[]> {
    return this.http.get<IssueInterface[]>(`${this.baseUrl}/${requestId}`, {withCredentials: true});
  }

  getIssueById(issueId: number): Observable<IssueInterface> {
    return this.http.get<IssueInterface>(`${this.baseUrl}/issue/${issueId}`, {withCredentials: true});
  }

  abandonIssue(issueId: number, result: String): Observable<any> {
    console.log(`Abandoning issue with ID: ${issueId} and result: ${result}`);
    return this.http.patch(`${this.baseUrl}/${issueId}/ABANDONED`,result, {withCredentials: true});
  }

  closeIssue(issueId: number, result: String): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${issueId}/CLOSED`,result, {withCredentials: true});
  }

  addIssue(issue: IssueRequestInterface, requestId: number): Observable<IssueInterface> {
    return this.http.post<IssueInterface>(`${this.baseUrl}/${requestId}`, issue, {withCredentials: true});
  }

}
