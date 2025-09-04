import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environment';
import { AuthService } from './auth';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private messageSubject = new BehaviorSubject<WebSocketMessage | null>(null);
  private connectionStatus = new BehaviorSubject<boolean>(false);

  public messages$ = this.messageSubject.asObservable();
  public isConnected$ = this.connectionStatus.asObservable();

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  private connect(): void {
    if (this.socket) return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      this.socket = io(environment.wsUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected to', environment.wsUrl);
        this.connectionStatus.next(true);
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 WebSocket disconnected');
        this.connectionStatus.next(false);
      });

      this.socket.on('connect_error', (error) => {
        console.warn('⚠️ WebSocket connection failed (this is optional):', error.message);
        this.connectionStatus.next(false);
        // Don't retry automatically to avoid spam
      });

    this.socket.on('message', (data: any) => {
      this.messageSubject.next({
        type: data.type,
        data: data.payload,
        timestamp: new Date(data.timestamp)
      });
    });

    // listener di eventi specifici
    this.socket.on('attendance_updated', (data) => {
      this.messageSubject.next({
        type: 'attendance_updated',
        data,
        timestamp: new Date()
      });
    });

    this.socket.on('justification_updated', (data) => {
      this.messageSubject.next({
        type: 'justification_updated',
        data,
        timestamp: new Date()
      });
    });

    this.socket.on('notification', (data) => {
      this.messageSubject.next({
        type: 'notification',
        data,
        timestamp: new Date()
      });
    });
    } catch (error) {
      console.warn('⚠️ WebSocket initialization failed (this is optional):', error);
      this.connectionStatus.next(false);
    }
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus.next(false);
    }
  }

  getMessagesOfType(type: string): Observable<WebSocketMessage> {
    return this.messages$.pipe(
      filter(message => message !== null && message.type === type),
      map(message => message!)
    );
  }

  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  joinRoom(room: string): void {
    this.emit('join_room', { room });
  }

  leaveRoom(room: string): void {
    this.emit('leave_room', { room });
  }
}
