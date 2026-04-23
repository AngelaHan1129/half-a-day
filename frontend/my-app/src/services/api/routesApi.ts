import { request } from './client';
import type { Route } from '../../types/route';

export const routeApi = {
  getAll: async (): Promise<Route[]> => request<Route[]>('/api/routes'),
  getById: async (id: number): Promise<Route> => request<Route>(`/api/routes/${id}`),
  search: async (keyword: string): Promise<Route[]> =>
    request<Route[]>('/api/routes/search', { params: { keyword } }),
  getByDuration: async (maxHours: number): Promise<Route[]> =>
    request<Route[]>('/api/routes/duration', { params: { maxHours } }),
  getBySeason: async (season: string): Promise<Route[]> =>
    request<Route[]>(`/api/routes/season/${season}`),
};