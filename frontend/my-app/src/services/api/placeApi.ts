import { request } from './client';
import type { Place, PlaceType } from '../../types/place';

export const placeApi = {
  getAll: async (): Promise<Place[]> => {
    return request<Place[]>('/api/places');
  },

  getById: async (id: number): Promise<Place> => {
    return request<Place>(`/api/places/${id}`);
  },

  getByType: async (type: PlaceType): Promise<Place[]> => {
    return request<Place[]>(`/api/places/type/${type}`);
  },

  search: async (keyword: string): Promise<Place[]> => {
    return request<Place[]>('/api/places/search', {
      params: { keyword },
    });
  },

  searchByLocation: async (q: string): Promise<Place[]> => {
    return request<Place[]>('/api/places/location', {
      params: { q },
    });
  },
};