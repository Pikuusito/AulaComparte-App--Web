import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-registro-form',
  imports: [FormsModule],
  templateUrl: './registro-form.html',
  styleUrl: './registro-form.css',
})
export class RegistroForm implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private redirectTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly name = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly acceptedTerms = signal(false);
  readonly isSubmitting = signal(false);
  readonly isRegistrationComplete = signal(false);
  readonly feedback = signal('');
  readonly passwordsDoNotMatch = computed(
    () => this.confirmPassword().length > 0 && this.password() !== this.confirmPassword(),
  );

  ngOnDestroy(): void {
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
  }

  onSubmit(): void {
    if (this.isRegistrationComplete()) {
      return;
    }

    if (this.name().trim().length < 2 || !this.email().trim() || this.password().length < 8) {
      this.feedback.set('Completa tus datos y usa una contraseña de al menos 8 caracteres.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.feedback.set('Las contraseñas no coinciden. Escríbelas nuevamente.');
      return;
    }

    if (!this.acceptedTerms()) {
      this.feedback.set('Debes aceptar los términos y condiciones.');
      return;
    }

    this.isSubmitting.set(true);
    this.feedback.set('');
    this.auth.register({ name: this.name().trim(), email: this.email().trim(), password: this.password() })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.feedback.set('');
          this.password.set('');
          this.confirmPassword.set('');
          this.isRegistrationComplete.set(true);
          this.redirectTimeout = setTimeout(() => void this.router.navigate(['/login']), 7200);
        },
        error: (error: HttpErrorResponse) => this.feedback.set(
          error.status === 409
            ? 'Ya existe una cuenta con ese correo.'
            : 'No se pudo crear la cuenta. Inténtalo nuevamente.',
        ),
      });
  }

  updateName(event: Event): void {
    this.name.set(this.getInputValue(event));
  }

  updateEmail(event: Event): void {
    this.email.set(this.getInputValue(event));
  }

  updatePassword(event: Event): void {
    this.password.set(this.getInputValue(event));
  }

  updateConfirmPassword(event: Event): void {
    this.confirmPassword.set(this.getInputValue(event));
  }

  updateTerms(event: Event): void {
    this.acceptedTerms.set(event.target instanceof HTMLInputElement ? event.target.checked : false);
  }

  private getInputValue(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value : '';
  }
}
