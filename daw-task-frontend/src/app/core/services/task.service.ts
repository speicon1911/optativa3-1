import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, TaskStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/tareas';

  private _tasks = signal<Task[]>([]);
  tasks = this._tasks.asReadonly();

  loadAll(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe(tasks => {
      this._tasks.set(tasks);
    });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => this._tasks.update(tasks => [...tasks, newTask]))
    );
  }

  update(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { ...task, id }).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(t => t.id !== id));
      })
    );
  }

  startTask(id: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/iniciar`, {}).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  completeTask(id: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/completar`, {}).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }
}
