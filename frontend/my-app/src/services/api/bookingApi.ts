import { request } from './client';
import type { Booking, BookingCreateRequest } from '../../types/booking';

export const bookingApi = {
  create: async (payload: BookingCreateRequest): Promise<Booking> => {
    return request<Booking>('/api/bookings', {
      method: 'POST',
      body: payload,
    });
  },

  getById: async (id: number): Promise<Booking> => {
    return request<Booking>(`/api/bookings/${id}`);
  },

  confirm: async (id: number): Promise<Booking> => {
    return request<Booking>(`/api/bookings/${id}/confirm`, {
      method: 'PUT',
    });
  },

  cancel: async (id: number): Promise<Booking> => {
    return request<Booking>(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  },

  complete: async (id: number): Promise<Booking> => {
    return request<Booking>(`/api/bookings/${id}/complete`, {
      method: 'PUT',
    });
  },

  getPending: async (): Promise<Booking[]> => {
    return request<Booking[]>('/api/bookings/pending');
  },

  getByUser: async (email: string): Promise<Booking[]> => {
    return request<Booking[]>('/api/bookings/user', {
      params: { email },
    });
  },

  getByRoute: async (routeId: number): Promise<Booking[]> => {
    return request<Booking[]>(`/api/bookings/route/${routeId}`);
  },

  getByUserAndStatus: async (
    email: string,
    status: string
  ): Promise<Booking[]> => {
    return request<Booking[]>('/api/bookings/user/status', {
      params: { email, status },
    });
  },
};