import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiNotification } from '../models/notification-api.model';
import { AuthService } from './auth.service';
import { NotificationApiService } from './notification-api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly visibleNotificationsLimit = 5;
  private readonly notificationApi = inject(NotificationApiService);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly notifications = signal<ApiNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly isLoading = signal(false);
  readonly loadError = signal('');
  readonly isNotificationsOpen = signal(false);
  readonly hasUnread = computed(() => this.unreadCount() > 0);
  readonly visibleNotifications = computed(() =>
    this.notifications().slice(0, this.visibleNotificationsLimit),
  );
  readonly hiddenNotificationsCount = computed(() =>
    Math.max(this.notifications().length - this.visibleNotificationsLimit, 0),
  );

  private readonly syncNotifications = effect((onCleanup) => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.auth.isLoggedIn()) {
      this.notifications.set([]);
      this.unreadCount.set(0);
      this.isNotificationsOpen.set(false);
      return;
    }

    this.loadNotifications();
    const intervalId = window.setInterval(() => this.refreshUnreadCount(), 30_000);
    onCleanup(() => window.clearInterval(intervalId));
  });

  toggleNotifications(): void {
    this.isNotificationsOpen.update((isOpen) => !isOpen);

    if (this.isNotificationsOpen()) {
      this.loadNotifications();
      this.markAllRead();
    }
  }

  closeNotifications(): void {
    this.isNotificationsOpen.set(false);
  }

  loadNotifications(): void {
    if (!this.auth.isLoggedIn()) {
      return;
    }

    this.isLoading.set(true);
    this.loadError.set('');

    this.notificationApi
      .loadNotifications()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (notifications) => {
          if (this.isNotificationsOpen()) {
            this.notifications.set(this.markNotificationsRead(notifications));
            this.unreadCount.set(0);

            if (notifications.some((notification) => !notification.is_read)) {
              this.markAllRead();
            }

            return;
          }

          this.notifications.set(notifications);
          this.unreadCount.set(notifications.filter((notification) => !notification.is_read).length);
        },
        error: (error: HttpErrorResponse) => {
          this.loadError.set(this.resolveErrorMessage(error));
        },
      });
  }

  refreshUnreadCount(): void {
    if (!this.auth.isLoggedIn()) {
      return;
    }

    if (this.isNotificationsOpen()) {
      this.unreadCount.set(0);
      return;
    }

    this.notificationApi.loadUnreadCount().subscribe({
      next: (response) => this.unreadCount.set(response.unread_count),
      error: () => undefined,
    });
  }

  private markAllRead(): void {
    this.unreadCount.set(0);
    this.notifications.update((notifications) => this.markNotificationsRead(notifications));

    this.notificationApi.markAllRead().subscribe({
      next: () => {
        this.unreadCount.set(0);
        this.notifications.update((notifications) => this.markNotificationsRead(notifications));
      },
      error: () => undefined,
    });
  }

  private markNotificationsRead(notifications: ApiNotification[]): ApiNotification[] {
    return notifications.map((notification) => ({ ...notification, is_read: true }));
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor de notificaciones.';
    }

    return 'No se pudieron cargar las notificaciones.';
  }
}
