import api from './axios';

export interface Species {
  id: number;
  latin_name: string;
  common_name: string;
  family: string | null;
  description: string | null;
  max_height_m: number | null;
}

export interface CreateSpeciesDto {
  latin_name: string;
  common_name: string;
  family?: string;
  description?: string;
  max_height_m?: number;
}

export const getSpecies = () => api.get<Species[]>('/species').then(r => r.data);
export const getSpeciesById = (id: number) => api.get<Species>(`/species/${id}`).then(r => r.data);
export const createSpecies = (dto: CreateSpeciesDto) => api.post<Species>('/species', dto).then(r => r.data);
export const updateSpecies = (id: number, dto: Partial<CreateSpeciesDto>) => api.patch<Species>(`/species/${id}`, dto).then(r => r.data);
export const deleteSpecies = (id: number) => api.delete(`/species/${id}`).then(r => r.data);
