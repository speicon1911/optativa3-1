export enum TaskStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA'
}

export interface User {
  id: number;
  username: string;
  email: string;
  rol: 'USER' | 'ADMIN';
}

export interface Task {
  id?: number;
  titulo: string;
  descripcion: string;
  fechaCreacion?: string;
  fechaVencimiento: string;
  estado: TaskStatus;
  idUsuario?: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthData {
  token: string;
  username: string;
  rol: 'USER' | 'ADMIN';
}
