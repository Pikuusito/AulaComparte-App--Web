import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'guest' | 'usuario' | 'moderador';

// Servicio para gestionar la autenticación y el rol del usuario en la aplicación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  // La sesion es temporal: al refrescar/cerrar la pagina vuelve a guest.
  readonly role = signal<UserRole>('guest');

  readonly isLoggedIn  = computed(() => this.role() !== 'guest');
  readonly isUsuario   = computed(() => this.role() === 'usuario');
  readonly isModerador = computed(() => this.role() === 'moderador');

  setRole(role: UserRole): void {
    this.role.set(role);
  }

  logout(): void {
    this.setRole('guest');
  }
}
