import type { Route } from './route';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  route: Route | null;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  travelDate: string;
  people: number;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingCreateRequest {
  route: { id: number };
  userName: string;
  userEmail: string;
  userPhone: string | null;
  travelDate: string;
  people: number;
  notes: string | null;
}