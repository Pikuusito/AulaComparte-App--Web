import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { PanelUiService } from '../../../pages/panel-usuario/services/panel-ui.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly panelUi = inject(PanelUiService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly notifications = inject(NotificationService);
  readonly profileRoute = computed(() => this.auth.isModerador() ? '/panel-moderador' : '/panel-usuario');
  readonly isProfileMenuOpen = signal(false);
  readonly currentUser = computed(() => this.auth.currentUser());

  get isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  openPublishResource(): void {
    this.panelUi.openPublishResource();
  }

  toggleProfileMenu(): void {
    this.notifications.closeNotifications();
    this.isProfileMenuOpen.update((isOpen) => !isOpen);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  toggleNotifications(): void {
    this.closeProfileMenu();
    this.notifications.toggleNotifications();
  }

  formatNotificationTime(value: string): string {
    const createdAt = new Date(value).getTime();
    const elapsedMinutes = Math.max(1, Math.floor((Date.now() - createdAt) / 60_000));

    if (elapsedMinutes < 60) {
      return `Hace ${elapsedMinutes} min`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `Hace ${elapsedHours} h`;
    }

    return `Hace ${Math.floor(elapsedHours / 24)} d`;
  }

  logout(): void {
    this.closeProfileMenu();
    this.notifications.closeNotifications();
    this.auth.logout();
  }
}
