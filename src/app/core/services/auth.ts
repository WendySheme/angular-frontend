import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { User, LoginCredentials, AuthResponse, ApiResponse } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenValidity();
  }

  login(credentials: LoginCredentials & { role?: string }): Observable<AuthResponse> {
    // Development bypass when backend is not available
    if (environment.enableAuthBypass && (environment as any).developmentUsers) {
      return this.handleDevLogin(credentials);
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        map(response => response.data),
        tap(authResponse => {
          this.setSession(authResponse);
          this.currentUserSubject.next(authResponse.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Login error:', error);
          // Fallback to dev login if backend is not available
          if (environment.enableAuthBypass) {
            console.warn('Backend not available, falling back to development bypass');
            return this.handleDevLogin(credentials);
          }
          return throwError(error);
        })
      );
  }

  private handleDevLogin(credentials: LoginCredentials & { role?: string }): Observable<AuthResponse> {
    const devUsers = (environment as any).developmentUsers;
    const user = devUsers[credentials.email];
    
    if (!user || credentials.password !== 'demo123') {
      return throwError({
        error: { message: 'Credenziali non valide. Usa email demo e password "demo123"' }
      });
    }

    // Simulate API delay
    return new Observable<AuthResponse>(subscriber => {
      setTimeout(() => {
        const authResponse: AuthResponse = {
          user: user,
          token: `dev-token-${user.id}-${Date.now()}`,
          refreshToken: `dev-refresh-${user.id}-${Date.now()}`
        };
        
        this.setSession(authResponse);
        this.currentUserSubject.next(authResponse.user);
        this.isAuthenticatedSubject.next(true);
        
        subscriber.next(authResponse);
        subscriber.complete();
      }, 800); // Simulate network delay
    });
  }

  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/refresh`, {
      refreshToken
    }).pipe(
      map(response => response.data),
      tap(authResponse => {
        this.setSession(authResponse);
        this.currentUserSubject.next(authResponse.user);
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private checkTokenValidity(): void {
    if (this.getToken() && !this.hasValidToken()) {
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }
  }
}
