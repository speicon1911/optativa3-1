import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, TaskStatus } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, RouterModule],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Mis Tareas</h2>
          <p class="text-slate-500 mt-1">Tienes {{ tasks().length }} tareas en total</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex p-1 bg-slate-100 rounded-2xl">
            <button (click)="filter.set('ALL')" 
                    [class.bg-white]="filter() === 'ALL'" [class.shadow-sm]="filter() === 'ALL'"
                    class="px-4 py-2 rounded-xl text-sm font-semibold transition-all">Todas</button>
            <button (click)="filter.set(TaskStatus.PENDIENTE)" 
                    [class.bg-white]="filter() === TaskStatus.PENDIENTE" [class.shadow-sm]="filter() === TaskStatus.PENDIENTE"
                    class="px-4 py-2 rounded-xl text-sm font-semibold transition-all text-amber-600">Pendientes</button>
            <button (click)="filter.set(TaskStatus.EN_PROGRESO)" 
                    [class.bg-white]="filter() === TaskStatus.EN_PROGRESO" [class.shadow-sm]="filter() === TaskStatus.EN_PROGRESO"
                    class="px-4 py-2 rounded-xl text-sm font-semibold transition-all text-blue-600">En Progreso</button>
            <button (click)="filter.set(TaskStatus.COMPLETADA)" 
                    [class.bg-white]="filter() === TaskStatus.COMPLETADA" [class.shadow-sm]="filter() === TaskStatus.COMPLETADA"
                    class="px-4 py-2 rounded-xl text-sm font-semibold transition-all text-emerald-600">Completadas</button>
          </div>
          
          <a routerLink="/tasks/new" 
             class="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center gap-2">
            <span>+</span> Nueva Tarea
          </a>
        </div>
      </div>

      <!-- Grid of tasks -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-task-card *ngFor="let task of filteredTasks()" 
                      [task]="task"
                      [canEdit]="authService.isAdmin()"
                      [canDelete]="authService.isAdmin()"
                      (start)="onStart($event)"
                      (complete)="onComplete($event)"
                      (edit)="onEdit($event)"
                      (delete)="onDelete($event)">
        </app-task-card>

        <!-- Empty State -->
        <div *ngIf="filteredTasks().length === 0" 
             class="col-span-full py-20 flex flex-col items-center justify-center glass rounded-3xl border-dashed border-2 border-slate-200">
          <span class="text-6xl mb-4">✨</span>
          <h3 class="text-xl font-bold text-slate-400">No hay tareas en esta categoría</h3>
          <p class="text-slate-400">¡Buen trabajo!</p>
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  TaskStatus = TaskStatus;
  tasks = this.taskService.tasks;
  filter = signal<'ALL' | TaskStatus>('ALL');

  filteredTasks = computed(() => {
    const currentFilter = this.filter();
    if (currentFilter === 'ALL') return this.tasks();
    return this.tasks().filter((t: Task) => t.estado === currentFilter);
  });

  ngOnInit() {
    this.taskService.loadAll();
  }

  onStart(id: number) {
    this.taskService.startTask(id).subscribe(() => {
      this.notificationService.show('Tarea iniciada', 'info');
    });
  }

  onComplete(id: number) {
    this.taskService.completeTask(id).subscribe(() => {
      this.notificationService.show('¡Tarea completada!', 'success');
    });
  }

  onEdit(task: Task) {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas borrar esta tarea?')) {
      this.taskService.delete(id).subscribe(() => {
        this.notificationService.show('Tarea eliminada', 'success');
      });
    }
  }
}
