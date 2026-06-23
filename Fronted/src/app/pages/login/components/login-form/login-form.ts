import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [RouterLink, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly email = signal('');
  readonly password = signal('');
  readonly isSubmitting = signal(false);
  readonly feedback = signal('');

  onSubmit(): void {
    if (!this.email().trim() || !this.password()) {
      this.feedback.set('Por favor, ingresa tu correo y contraseña.');
      return;
    }
    this.isSubmitting.set(true);
    this.feedback.set('');
    this.auth.login({ email: this.email().trim(), password: this.password() })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: ({ user }) => void this.router.navigate([
          user.role === 'moderator' ? '/panel-moderador' : '/panel-usuario',
        ]),
        error: (error: HttpErrorResponse) => this.feedback.set(
          error.status === 401
            ? 'El correo o la contraseña son incorrectos.'
            : 'No se pudo conectar con el servidor. Inténtalo nuevamente.',
        ),
      });
  }

  updateEmail(event: Event): void {
    this.email.set(this.getInputValue(event));
  }

  updatePassword(event: Event): void {
    this.password.set(this.getInputValue(event));
  }

  private getInputValue(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value : '';
  }
}
