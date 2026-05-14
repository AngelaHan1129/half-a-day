import { request } from "./client";
import type {
  CreatePlacePayload,
  Place,
  PlaceType,
  PlaceUiType,
} from "../../types/place";
import { PLACE_TYPE_VALUE } from "../../types/place";

export const placeApi = {
  getAll: async (): Promise<Place[]> => {
    return request<Place[]>("/api/places");
  },

  getById: async (id: number): Promise<Place> => {
    return request<Place>(`/api/places/${id}`);
  },

  getByType: async (type: PlaceType): Promise<Place[]> => {
    return request<Place[]>(`/api/places/type/${type}`);
  },

  getByUiType: async (type: PlaceUiType): Promise<Place[]> => {
    return request<Place[]>(`/api/places/type/${PLACE_TYPE_VALUE[type]}`);
  },

  search: async (keyword: string): Promise<Place[]> => {
    return request<Place[]>("/api/places/search", {
      params: { keyword },
    });
  },

  searchByLocation: async (q: string): Promise<Place[]> => {
    return request<Place[]>("/api/places/location", {
      params: { q },
    });
  },

  create: async (payload: CreatePlacePayload): Promise<Place> => {
    return request<Place>("/api/places", {
      method: "POST",
      body: payload,
      auth: true,
    });
  },

  update: async (id: number, payload: CreatePlacePayload): Promise<Place> => {
    return request<Place>(`/api/places/${id}`, {
      method: "PUT",
      body: payload,
      auth: true,
    });
  },

  delete: async (id: number): Promise<void> => {
    return request<void>(`/api/places/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  createBatch: async (payload: CreatePlacePayload[]): Promise<Place[]> => {
    return request<Place[]>("/api/places/batch", {
      method: "POST",
      body: payload,
      auth: true,
    });
  },
};