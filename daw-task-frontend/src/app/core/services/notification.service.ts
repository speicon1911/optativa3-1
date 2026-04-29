import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now();
    this._notifications.update(n => [...n, { message, type, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number) {
    this._notifications.update(n => n.filter(notification => notification.id !== id));
  }
}
