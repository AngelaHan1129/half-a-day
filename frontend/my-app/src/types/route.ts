import type { Place } from './place';

export interface RouteSummary {
  id: number;
  name: string;
  description: string | null;
  durationHours: number | null;
  suitableSeasons: string | null;
  difficulty: string | null;
  groupSizeNote: string | null;
  coverImage: string | null;
}

export interface RouteStop {
  id: number;
  route?: RouteSummary;
  place: Place;
  stopOrder: number;
  stayMinutes: number | null;
  note: string | null;
  transportToNext: string | null;
}

export interface Route {
  id: number;
  name: string;
  description: string | null;
  durationHours: number | null;
  suitableSeasons: string | null;
  difficulty: string | null;
  groupSizeNote: string | null;
  coverImage: string | null;
  stops: RouteStop[];
}