import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiNotification, ApiNotificationUnreadCount } from '../models/notification-api.model';

const NOTIFICATIONS_API_URL = 'http://localhost:8000/api/notifications';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);

  loadNotifications(): Observable<ApiNotification[]> {
    return this.http.get<ApiNotification[]>(NOTIFICATIONS_API_URL);
  }

  loadUnreadCount(): Observable<ApiNotificationUnreadCount> {
    return this.http.get<ApiNotificationUnreadCount>(`${NOTIFICATIONS_API_URL}/unread-count`);
  }

  markRead(notificationId: number): Observable<ApiNotification> {
    return this.http.patch<ApiNotification>(`${NOTIFICATIONS_API_URL}/${notificationId}/read`, {});
  }

  markAllRead(): Observable<void> {
    return this.http.patch<void>(`${NOTIFICATIONS_API_URL}/read-all`, {});
  }
}
