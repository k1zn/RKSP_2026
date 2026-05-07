import api from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number | null;
  role: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
  password?: string;
  role?: string;
}

export const getUsers = () => api.get<User[]>('/users').then(r => r.data);
export const getUserById = (id: number) => api.get<User>(`/users/${id}`).then(r => r.data);
export const createUser = (dto: CreateUserDto) => api.post<User>('/users', dto).then(r => r.data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then(r => r.data);
