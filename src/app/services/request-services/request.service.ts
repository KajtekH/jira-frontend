import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RequestInterface} from "../../models/request/request.interface";
import {RequestRequestInterface} from "../../models/request/requestRequest.interface";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = 'http://localhost:8080/api/requests';

  constructor(private http: HttpClient) { }

  getRequests(productId: number): Observable<RequestInterface[]> {
    return this.http.get<RequestInterface[]>(`${this.baseUrl}/${productId}`);
  }

  getRequestById(requestId: number): Observable<RequestInterface> {
    return this.http.get<RequestInterface>(`${this.baseUrl}/request/${requestId}`, {});
  }

  addRequest(requestRequest: RequestRequestInterface, productId: number): Observable<RequestInterface> {
    return this.http.post<RequestInterface>(`${this.baseUrl}/${productId}`, requestRequest);
  }

  closeRequest(requestId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${requestId}/CLOSED`, {});
  }

  abandonRequest(requestId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${requestId}/ABANDONED`, {});
  }
}
