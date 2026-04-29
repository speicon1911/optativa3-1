import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 glass border-r border-slate-200 hidden md:flex flex-col">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <span class="p-2 bg-primary-100 rounded-lg">🚀</span>
            DAW Task
          </h1>
        </div>
        
        <nav class="flex-1 px-4 py-4 space-y-2">
          <a routerLink="/tasks" routerLinkActive="bg-primary-50 text-primary-600" 
             class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-100 text-slate-600">
            <span>📋</span> Tareas
          </a>
        </nav>

        <div class="p-4 border-t border-slate-100">
          <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100/50">
            <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
              {{ authService.currentUser()?.username?.[0]?.toUpperCase() }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-sm font-semibold truncate">{{ authService.currentUser()?.username }}</p>
              <p class="text-xs text-slate-500">{{ authService.currentUser()?.rol }}</p>
            </div>
          </div>
          <button (click)="authService.logout()" 
                  class="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 glass border-b border-slate-200 flex items-center justify-between px-8 md:justify-end">
          <button class="md:hidden p-2 text-slate-600">☰</button>
          <div class="flex items-center gap-4">
             <span class="text-sm text-slate-500">{{ today | date:'fullDate' }}</span>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Toasts -->
      <div class="fixed bottom-4 right-4 z-50 space-y-2">
        <div *ngFor="let n of notificationService.notifications()" 
             [ngClass]="{
               'bg-emerald-500': n.type === 'success',
               'bg-rose-500': n.type === 'error',
               'bg-blue-500': n.type === 'info'
             }"
             class="px-6 py-4 rounded-2xl text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-10 duration-300">
          <span>{{ n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️' }}</span>
          <p class="font-medium">{{ n.message }}</p>
          <button (click)="notificationService.remove(n.id)" class="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  today = new Date();
}
