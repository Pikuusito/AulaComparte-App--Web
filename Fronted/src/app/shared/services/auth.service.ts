import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { AuthSessionStorageService } from './auth-session-storage.service';

const AUTH_API_URL = 'http://localhost:8000/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionStorage = inject(AuthSessionStorageService);
  private readonly storedSession = this.sessionStorage.read();

  readonly currentUser = signal<AuthUser | null>(this.storedSession?.user ?? null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isUsuario = computed(() => this.currentUser()?.role === 'user');
  readonly isModerador = computed(() => this.currentUser()?.role === 'moderator');

  constructor() {
    if (this.storedSession) {
      this.restoreSession(this.storedSession.accessToken);
    }
  }

  register(request: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${AUTH_API_URL}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${AUTH_API_URL}/login`, request).pipe(
      tap((response) => {
        this.currentUser.set(response.user);
        this.sessionStorage.save({ accessToken: response.access_token, user: response.user });
      }),
    );
  }

  logout(): void {
    this.sessionStorage.clear();
    this.currentUser.set(null);
    void this.router.navigate(['/login']);
  }

  private restoreSession(accessToken: string): void {
    this.http.get<AuthUser>(`${AUTH_API_URL}/me`).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.sessionStorage.save({ accessToken, user });
      },
      error: () => this.logout(),
    });
  }
}
