import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="max-w-md w-full glass p-8 rounded-3xl shadow-2xl border border-white/50">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-900">Crear Cuenta</h2>
          <p class="text-slate-500 mt-2">Únete para empezar a organizar tus tareas</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700 ml-1">Usuario</label>
            <input type="text" formControlName="username" 
                   class="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                   placeholder="Nombre de usuario">
          </div>

          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700 ml-1">Email</label>
            <input type="email" formControlName="email" 
                   class="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                   placeholder="correo@ejemplo.com">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
              <input type="password" formControlName="password" 
                     class="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                     placeholder="••••••••">
            </div>

            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Confirmar</label>
              <input type="password" formControlName="confirmPassword" 
                     class="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                     placeholder="••••••••">
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading"
                  class="w-full mt-4 py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98]">
            {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-slate-600">
            ¿Ya tienes cuenta? 
            <a routerLink="/login" class="text-primary-600 font-bold hover:underline">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = false;
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const val = this.registerForm.value;
    if (val.password !== val.confirmPassword) {
      this.notificationService.show('Las contraseñas no coinciden', 'error');
      return;
    }

    this.loading = true;
    const requestData = {
      username: val.username,
      email: val.email,
      password1: val.password,
      password2: val.confirmPassword
    };

    this.authService.register(requestData).subscribe({
      next: () => {
        this.notificationService.show('Cuenta creada con éxito', 'success');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
