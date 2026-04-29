import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="max-w-md w-full glass p-8 rounded-3xl shadow-2xl border border-white/50">
        <div class="text-center mb-10">
          <div class="inline-flex p-4 bg-primary-100 rounded-2xl mb-4">
            <span class="text-3xl">🚀</span>
          </div>
          <h2 class="text-3xl font-bold text-slate-900">Bienvenido de nuevo</h2>
          <p class="text-slate-500 mt-2">Gestiona tus tareas de forma eficiente</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 ml-1">Usuario</label>
            <input type="text" formControlName="username" 
                   class="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                   placeholder="Tu nombre de usuario">
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
            <input type="password" formControlName="password" 
                   class="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                   placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading"
                  class="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 transition-all active:scale-[0.98]">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-slate-600">
            ¿No tienes cuenta? 
            <a routerLink="/register" class="text-primary-600 font-bold hover:underline">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = false;
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.notificationService.show('¡Bienvenido!', 'success');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
