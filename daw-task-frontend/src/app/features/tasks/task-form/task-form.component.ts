import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskStatus } from '../../../core/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <a routerLink="/tasks" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">← Volver</a>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}
        </h2>
      </div>

      <div class="glass p-8 rounded-3xl shadow-xl border border-white/50">
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 ml-1">Título</label>
            <input type="text" formControlName="titulo" 
                   class="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                   placeholder="¿Qué hay que hacer?">
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 ml-1">Descripción</label>
            <textarea formControlName="descripcion" rows="4"
                   class="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                   placeholder="Añade más detalles..."></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700 ml-1">Fecha Vencimiento</label>
              <input type="date" formControlName="fechaVencimiento" 
                     class="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none">
            </div>
          </div>

          <div class="pt-4 flex gap-4">
             <button type="button" routerLink="/tasks"
                    class="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-lg transition-all">
              Cancelar
            </button>
            <button type="submit" [disabled]="taskForm.invalid || loading"
                    class="flex-[2] py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 transition-all active:scale-[0.98]">
              {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar Tarea' : 'Crear Tarea') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  loading = false;
  isEdit = false;
  taskId?: number;

  taskForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    fechaVencimiento: ['', [Validators.required]]
  });

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEdit = true;
      this.loadTask();
    }
  }

  loadTask() {
    this.taskService.getById(this.taskId!).subscribe({
      next: (task: any) => {
        this.taskForm.patchValue({
          titulo: task.titulo,
          descripcion: task.descripcion,
          fechaVencimiento: task.fechaVencimiento
        });
      }
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    this.loading = true;
    const taskData = this.taskForm.value as any;

    const request = this.isEdit 
      ? this.taskService.update(this.taskId!, taskData)
      : this.taskService.create(taskData);

    request.subscribe({
      next: () => {
        this.notificationService.show(
          this.isEdit ? 'Tarea actualizada' : 'Tarea creada con éxito', 
          'success'
        );
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
