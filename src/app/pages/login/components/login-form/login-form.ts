import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [RouterLink, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})

// Lógica Básica para inicio de sesión, sin validación real ni conexión a backend. (Temporal)
export class LoginForm {
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly isSubmitting = signal(false);
  readonly feedback = signal('');

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.email().trim() || !this.password().trim()) {
      this.feedback.set('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    this.isSubmitting.set(true);
    this.feedback.set('');

    // Simular un breve delay de carga
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/panel-estudiante']);
    }, 600);
  }
}
