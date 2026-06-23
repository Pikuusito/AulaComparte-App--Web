import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-welcome-header',
  standalone: true,
  templateUrl: './welcome-header.html',
  styleUrl: './welcome-header.css',
})
export class WelcomeHeaderComponent {
  private readonly auth = inject(AuthService);

  protected readonly userName = computed(() => this.auth.currentUser()?.name.trim() || 'estudiante');
}
