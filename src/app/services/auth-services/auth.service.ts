import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../../models/auth/login-request";
import {interval, Observable, Subscription} from "rxjs";
import {LoginResponse} from "../../models/auth/login-response";
import {HOST} from "../host.constant";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshSubscription: Subscription | undefined;

  private baseUrl =`${HOST}/auth`;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest, {withCredentials: true});
  }

  logout(): Observable<any> {
    console.log('Logout called');
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }

  register(registerRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerRequest, { withCredentials: true });
  }

  startTokenRefresh() {
    const exp = localStorage.getItem('exp');
    if (exp) {
      const expTime = Number(exp) * 1000;
      const currentTime = Date.now();
      const refreshTime = expTime - currentTime - 30000;

      if(this.refreshSubscription) {
        this.refreshSubscription.unsubscribe();
      }

      if (refreshTime > 0) {
        this.refreshSubscription = interval(refreshTime).subscribe(() => {
          this.refreshToken();
        });
      } else {
        this.refreshToken();
      }
    }
  }

  public refreshToken() {
    this.http.post(`${this.baseUrl}/refresh`,{}, { withCredentials: true })
      .subscribe(
        (response: any) => {
          console.log('Token refreshed:', response);
          localStorage.setItem('exp', String(response.exp));
          this.startTokenRefresh();
        },
        (error) => {
          console.error('Token refresh failed:', error);
        }
      );
  }

  stopTokenRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
