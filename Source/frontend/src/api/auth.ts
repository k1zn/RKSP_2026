import api from './axios';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}
