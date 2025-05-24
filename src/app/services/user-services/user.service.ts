import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserInterface} from "../../models/user/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserInterface[]> {
    return this.http.get<any>(`${this.baseUrl}`, {withCredentials: true});
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/role/${userId}/${role}` ,null, { withCredentials: true });
  }

  changeUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/activation/${userId}/${isActive}`,null , { withCredentials: true });
  }

}
