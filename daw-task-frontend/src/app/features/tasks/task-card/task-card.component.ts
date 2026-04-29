import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass p-6 rounded-3xl border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div class="flex justify-between items-start mb-4">
        <span [ngClass]="{
          'bg-amber-100 text-amber-700': task.estado === TaskStatus.PENDIENTE,
          'bg-blue-100 text-blue-700': task.estado === TaskStatus.EN_PROGRESO,
          'bg-emerald-100 text-emerald-700': task.estado === TaskStatus.COMPLETADA
        }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {{ task.estado.replace('_', ' ') }}
        </span>
        
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button *ngIf="canEdit" (click)="edit.emit(task)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500">✏️</button>
          <button *ngIf="canDelete" (click)="delete.emit(task.id!)" class="p-2 hover:bg-rose-50 rounded-lg text-rose-500">🗑️</button>
        </div>
      </div>

      <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
        {{ task.titulo }}
      </h3>
      <p class="text-slate-500 text-sm line-clamp-2 mb-6">
        {{ task.descripcion }}
      </p>

      <div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
        <div class="flex items-center gap-2 text-slate-400 text-xs">
          <span>📅</span>
          <span>Vence: {{ task.fechaVencimiento | date:'mediumDate' }}</span>
        </div>

        <div class="flex gap-2">
          <button *ngIf="task.estado === TaskStatus.PENDIENTE" 
                  (click)="start.emit(task.id!)"
                  class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
            Iniciar
          </button>
          <button *ngIf="task.estado === TaskStatus.EN_PROGRESO" 
                  (click)="complete.emit(task.id!)"
                  class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">
            Completar
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() canEdit = false;
  @Input() canDelete = false;

  TaskStatus = TaskStatus;

  @Output() start = new EventEmitter<number>();
  @Output() complete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
}
