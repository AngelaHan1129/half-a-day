import { request } from "./client";
import type { Route } from "../../types/route";

export const routeApi = {
  getAll: async (): Promise<Route[]> => request<Route[]>("/api/routes"),

  getById: async (id: number | string): Promise<Route> =>
    request<Route>(`/api/routes/${id}`),

  search: async (keyword: string): Promise<Route[]> =>
    request<Route[]>("/api/routes/search", { params: { keyword } }),

  getByDuration: async (maxHours: number): Promise<Route[]> =>
    request<Route[]>("/api/routes/duration", { params: { maxHours } }),

  getBySeason: async (season: string): Promise<Route[]> =>
    request<Route[]>(`/api/routes/season/${season}`),

  create: async (payload: Partial<Route>, token: string): Promise<Route> =>
    request<Route>("/api/routes", {
      method: "POST",
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  update: async (
    id: number | string,
    payload: Partial<Route>,
    token: string
  ): Promise<Route> =>
    request<Route>(`/api/routes/${id}`, {
      method: "PUT",
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  remove: async (id: number | string, token: string): Promise<void> =>
    request<void>(`/api/routes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};