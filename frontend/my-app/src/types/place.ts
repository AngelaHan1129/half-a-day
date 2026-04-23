export type PlaceType =
  | 'SCENIC_SPOT'
  | 'RESTAURANT'
  | 'HOTEL'
  | 'ACTIVITY';

export interface Place {
  id: number;
  name: string;
  type: PlaceType;
  description: string | null;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  avgPrice: number | null;
  imageUrls: string | null;
  mapUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}