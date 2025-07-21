import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api';
import { WebSocketService } from './websocket';
import { Notification } from '../../shared/models/notification';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastNotification[]>([]);
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public toasts$ = this.toastsSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
    this.loadNotifications();
  }



  // notifiche toast
  showToast(notification: Omit<ToastNotification, 'id'>): void {
    const toast: ToastNotification = {
      ...notification,
      id: this.generateId(),
      duration: notification.duration || 5000
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (!toast.persistent) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  success(title: string, message: string, duration?: number): void {
    this.showToast({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, persistent?: boolean): void {
    this.showToast({ type: 'error', title, message, persistent });
  }

  warning(title: string, message: string, duration?: number): void {
    this.showToast({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): void {
    this.showToast({ type: 'info', title, message, duration });
  }

  // notifiche database
  loadNotifications(): Observable<Notification[]> {
    return this.apiService.get<Notification[]>('/notifications').pipe(
      tap((notifications: Notification[]) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.apiService.patch<void>(`/notifications/${notificationId}/read`, {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }
      
  markAllAsRead(): Observable<void> {
    return this.apiService.patch<void>('/notifications/read-all', {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(0);
      })
    );
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType('notification').subscribe(message => {
      const notification: Notification = message.data;
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentNotifications]);
      this.updateUnreadCount([notification, ...currentNotifications]);

      // mostra toast per nuova notifica
      this.showToast({
        type: 'info',
        title: notification.title,
        message: notification.message
      });
    });
  }


  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}