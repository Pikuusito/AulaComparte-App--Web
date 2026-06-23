export type ApiNotificationType = 'resource_approved' | 'resource_rejected';

export interface ApiNotification {
  id: number;
  user_id: number;
  resource_id: number | null;
  title: string;
  message: string;
  type: ApiNotificationType;
  is_read: boolean;
  created_at: string;
}

export interface ApiNotificationUnreadCount {
  unread_count: number;
}
