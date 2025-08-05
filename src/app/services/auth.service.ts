import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterPostData } from '../interfaces/registerPostData';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  registerUser(postData: RegisterPostData) {
    return this.http.post(`${this.baseUrl}/users`, postData)
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
  }

  getUserDetails(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`)
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
  }
}
