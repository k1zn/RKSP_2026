import api from './axios';

export interface Location {
  id: number;
  name: string;
  address: string | null;
  area_ha: number | null;
  description: string | null;
}

export interface CreateLocationDto {
  name: string;
  address?: string;
  area_ha?: number;
  description?: string;
}

export const getLocations = () => api.get<Location[]>('/locations').then(r => r.data);
export const getLocationById = (id: number) => api.get<Location>(`/locations/${id}`).then(r => r.data);
export const createLocation = (dto: CreateLocationDto) => api.post<Location>('/locations', dto).then(r => r.data);
export const updateLocation = (id: number, dto: Partial<CreateLocationDto>) => api.patch<Location>(`/locations/${id}`, dto).then(r => r.data);
export const deleteLocation = (id: number) => api.delete(`/locations/${id}`).then(r => r.data);
