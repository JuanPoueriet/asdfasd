import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NotificationsPage } from './notifications.page';
import { NotificationCenterService } from '@univeex/notifications/data-access';
import { Notification } from '@univeex/notifications/domain';

class MockNotificationCenterService {
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  markAsRead = jest.fn();
  markAllAsRead = jest.fn();
  initialize = jest.fn();
}

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;
  let notificationService: MockNotificationCenterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        { provide: NotificationCenterService, useClass: MockNotificationCenterService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationCenterService) as unknown as MockNotificationCenterService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notifications from the service', () => {
    const mockNotifications: Notification[] = [
      { id: '1', title: 'Test 1', body: 'Body 1', read: false, createdAt: new Date().toISOString(), type: 'default', link: '' },
      { id: '2', title: 'Test 2', body: 'Body 2', read: true, createdAt: new Date().toISOString(), type: 'default', link: '' },
    ];
    notificationService.notifications.set(mockNotifications);
    fixture.detectChanges();
    const notificationElements = fixture.nativeElement.querySelectorAll('.notification-item');
    expect(notificationElements.length).toBe(mockNotifications.length);
  });

  it('should call markAsRead when a notification is clicked', () => {
    const mockNotifications: Notification[] = [
        { id: '1', title: 'Test 1', body: 'Body 1', read: false, createdAt: new Date().toISOString(), type: 'default', link: '' }
    ];
    notificationService.notifications.set(mockNotifications);
    fixture.detectChanges();
    const notificationElement = fixture.nativeElement.querySelector('.notification-item');
    notificationElement.click();
    expect(notificationService.markAsRead).toHaveBeenCalledWith('1');
  });

  it('should call markAllAsRead when the "mark all as read" button is clicked', () => {
    fixture.detectChanges();
    const markAllButton = fixture.nativeElement.querySelector('.mark-all-read-button');
    markAllButton.click();
    expect(notificationService.markAllAsRead).toHaveBeenCalled();
  });
});
