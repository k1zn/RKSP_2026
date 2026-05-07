import api from './axios';
import { Species } from './species';
import { Location } from './locations';

export interface Tree {
  id: number;
  species_id: number;
  location_id: number | null;
  plant_date: string | null;
  health_status: 'healthy' | 'ill' | 'dead';
  notes: string | null;
  species: Species;
  location: Location | null;
}

export interface CreateTreeDto {
  species_id: number;
  location_id?: number;
  plant_date?: string;
  health_status?: string;
  notes?: string;
}

export const getTrees = () => api.get<Tree[]>('/trees').then(r => r.data);
export const getTreeById = (id: number) => api.get<Tree>(`/trees/${id}`).then(r => r.data);
export const createTree = (dto: CreateTreeDto) => api.post<Tree>('/trees', dto).then(r => r.data);
export const updateTree = (id: number, dto: Partial<CreateTreeDto>) => api.patch<Tree>(`/trees/${id}`, dto).then(r => r.data);
export const deleteTree = (id: number) => api.delete(`/trees/${id}`).then(r => r.data);
