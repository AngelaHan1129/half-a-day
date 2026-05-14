export type PlaceType =
  | "SCENIC_SPOT"
  | "RESTAURANT"
  | "HOTEL"
  | "ACTIVITY";

export type PlaceUiType = "景點" | "餐飲" | "住宿" | "活動";

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
  updatedAt?: string | null;
}

export interface CreatePlacePayload {
  name: string;
  type: PlaceType;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  avgPrice?: number | null;
  imageUrls?: string | null;
  mapUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const PLACE_TYPE_LABEL: Record<PlaceType, PlaceUiType> = {
  SCENIC_SPOT: "景點",
  RESTAURANT: "餐飲",
  HOTEL: "住宿",
  ACTIVITY: "活動",
};

export const PLACE_TYPE_VALUE: Record<PlaceUiType, PlaceType> = {
  景點: "SCENIC_SPOT",
  餐飲: "RESTAURANT",
  住宿: "HOTEL",
  活動: "ACTIVITY",
};

export const PLACE_UI_TYPE_OPTIONS: Array<PlaceUiType | "全部"> = [
  "全部",
  "景點",
  "餐飲",
  "住宿",
  "活動",
];