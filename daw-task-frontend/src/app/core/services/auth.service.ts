import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, AuthData } from '../models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8081';

  // Signals for state management
  private _currentUser = signal<AuthData | null>(this.loadUserFromStorage());
  
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.rol === 'ADMIN');

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(userData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_data');
    }
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(response: LoginResponse) {
    const decoded: any = jwtDecode(response.access);
    const authData: AuthData = {
      token: response.access,
      username: decoded.sub,
      rol: decoded.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_data', JSON.stringify(authData));
    }
    this._currentUser.set(authData);
  }

  private loadUserFromStorage(): AuthData | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('auth_data');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return this._currentUser()?.token || null;
  }
}
