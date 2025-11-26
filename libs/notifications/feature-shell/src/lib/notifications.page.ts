import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, BellOff } from 'lucide-angular';
import { NotificationCenterService } from '@univeex/notifications/data-access';
import { Notification } from '@univeex/notifications/domain';

interface NotificationGroup {
  period: string;
  notifications: Notification[];
}

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPage {
  notificationCenter: NotificationCenterService = inject(NotificationCenterService);

  // Íconos
  protected readonly MarkAllReadIcon = Check;
  protected readonly NoNotificationsIcon = BellOff;

  notifications = this.notificationCenter.notifications;

  notificationGroups = computed(() => this.groupNotificationsByDate(this.notifications()));

  private groupNotificationsByDate(notifications: Notification[]): NotificationGroup[] {
    const groups: { [key: string]: Notification[] } = {
      'Hoy': [],
      'Ayer': [],
      'Esta Semana': [],
      'Anteriores': [],
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    for (const notification of notifications) {
      const notificationDate = new Date(notification.createdAt);
      if (notificationDate.toDateString() === today.toDateString()) {
        groups['Hoy'].push(notification);
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groups['Ayer'].push(notification);
      } else if (notificationDate > oneWeekAgo) {
        groups['Esta Semana'].push(notification);
      } else {
        groups['Anteriores'].push(notification);
      }
    }

    return Object.keys(groups)
      .map(period => ({ period, notifications: groups[period] }))
      .filter(group => group.notifications.length > 0);
  }

  markAsRead(notificationId: string): void {
    this.notificationCenter.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationCenter.markAllAsRead();
  }
}
