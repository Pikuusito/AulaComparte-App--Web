import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AuthSession, AuthUser } from '../models/auth.model';

const STORAGE_KEY = 'aulacomparte.auth';

@Injectable({ providedIn: 'root' })
export class AuthSessionStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  read(): AuthSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const rawSession = localStorage.getItem(STORAGE_KEY);
    if (!rawSession) {
      return null;
    }
    try {
      const value: unknown = JSON.parse(rawSession);
      return this.isAuthSession(value) ? value : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  save(session: AuthSession): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  getAccessToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  private isAuthSession(value: unknown): value is AuthSession {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const candidate = value as { accessToken?: unknown; user?: unknown };
    return typeof candidate.accessToken === 'string' && this.isAuthUser(candidate.user);
  }

  private isAuthUser(value: unknown): value is AuthUser {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const candidate = value as Partial<AuthUser>;
    return (
      typeof candidate.id === 'number' &&
      typeof candidate.name === 'string' &&
      typeof candidate.email === 'string' &&
      (candidate.role === 'user' || candidate.role === 'moderator') &&
      typeof candidate.created_at === 'string'
    );
  }
}
