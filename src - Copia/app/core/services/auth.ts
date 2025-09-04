import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { LoginCredentials, AuthResponse, ApiResponse } from '../models/interfaces';
import { User } from '../../shared/models/user';


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

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Development bypass when backend is not available
    if (environment.enableAuthBypass && (environment as any).developmentUsers) {
      return this.handleDevLogin(credentials);
    }

    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log('Login Request Details:');
    console.log('URL:', `${environment.apiUrl}/auth/login`);
    console.log('Payload:', JSON.stringify(credentials, null, 2));
    console.log('Headers:', httpOptions);

    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials, httpOptions)
      .pipe(
        map(response => {
          console.log(' Login Success Response:', JSON.stringify(response, null, 2));
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
          }
          return response.data;
        }),
        tap(authResponse => {
          this.setSession(authResponse);
          this.currentUserSubject.next(authResponse.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error(' Login error:', error);
          console.error('🔍Full error details:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message,
            error: error.error,
            headers: error.headers?.keys()?.map((key: string) => ({ [key]: error.headers.get(key) }))
          });
          console.error(' Request that failed:', JSON.stringify(credentials, null, 2));

          // Fallback to dev login if backend is not available
          if (environment.enableAuthBypass) {
            console.warn('Backend not available, falling back to development bypass');
            return this.handleDevLogin(credentials);
          }
          return throwError(error);
        })
      );
  }

  private handleDevLogin(credentials: LoginCredentials): Observable<AuthResponse> {
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

    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/refresh`, {
      refreshToken
    }, httpOptions).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Token refresh failed');
        }
        return response.data;
      }),
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
    return user ? (user.ruolo === role || user.role === role) : false;
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
      // Handle both JWT tokens and dev tokens
      if (token.startsWith('dev-token-')) {
        return true; // Dev tokens don't expire
      }

      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
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

  // Development method to test different payload formats
  testPayloadFormats(email: string, password: string): void {
    if (!environment.production) {
      const payloadVariations = [
        { email, password }, // Basic format
        { email, password, role: 'ADMIN' }, // With role field
        { email, password, ruolo: 'ADMIN' }, // Italian ruolo field
        { email, password, role: 'ADMIN', ruolo: 'ADMIN' }, // Both fields
      ];

      console.group(' Testing Payload Variations');
      payloadVariations.forEach((payload, index) => {
        console.log(`\nVariation ${index + 1}:`);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        // Test each variation
        this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, payload, {
          headers: { 'Content-Type': 'application/json' }
        }).subscribe({
          next: (response) => {
            console.log(` Variation ${index + 1} SUCCESS:`, response);
          },
          error: (error) => {
            console.log(` Variation ${index + 1} FAILED:`, {
              status: error.status,
              message: error.error?.message,
              errorCode: error.error?.errorCode
            });
          }
        });
      });
      console.groupEnd();
    }
  }
}

