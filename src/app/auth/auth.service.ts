import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:3000/auth'; // Update with your backend URL

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: any) {
    return this.http.post<{ message: string }>(`${this.base}/signup`, data);
  }

  login(data: any) {
    return this.http.post<{ token: string }>(`${this.base}/login`, data);
  }

  storeToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken() {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
