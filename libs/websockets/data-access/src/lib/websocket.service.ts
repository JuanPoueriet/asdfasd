import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: Socket | null = null;
  private connectionReady = new Subject<void>();
  public connectionReady$ = this.connectionReady.asObservable();

  // TODO: Refactor environment
  private baseUrl = ''; // environment.apiUrl.split('/api')[0];

  constructor() {}

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    // Fallback or fix properly
    const baseUrl = this.baseUrl || window.location.origin;

    console.log('Attempting to connect WebSocket...');
    this.socket = io(baseUrl, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected successfully!', this.socket?.id);
      this.connectionReady.next();
    });

    this.socket.on('disconnect', (reason) => console.log('WebSocket disconnected:', reason));
    this.socket.on('connect_error', (err) => console.error('WebSocket connection error:', err.message));
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable(observer => {
      if (!this.socket) {
        return;
      }
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket?.off(eventName);
      };
    });
  }

  emit(eventName: string, data: any): void {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
