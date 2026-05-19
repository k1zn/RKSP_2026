import api from './axios';

export interface HealthAuditLog {
  id: number;
  tree_id: number;
  old_status: string | null;
  new_status: string | null;
  changed_at: string;
  tree?: {
    species?: { common_name: string };
    location?: { name: string };
  };
}

export const getHealthAuditLog = () =>
  api.get<HealthAuditLog[]>('/audit/health').then(r => r.data);
