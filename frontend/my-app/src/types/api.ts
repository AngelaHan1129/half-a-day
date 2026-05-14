export type PlaceType = "景點" | "自然" | "文化" | "餐飲" | "住宿";

export type PlaceStatus = "published" | "draft";

export type PlaceRow = {
  id: number;
  name: string;
  type: PlaceType;
  location: string;
  status: PlaceStatus;
  updatedAt: string;
};

export type PlaceApiType =
  | "SCENIC_SPOT"
  | "NATURAL"
  | "CULTURE"
  | "FOOD"
  | "HOTEL"
  | string;

export type PlaceApiItem = {
  id: number;
  name: string;
  type: PlaceApiType;
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  avgPrice?: number;
  imageUrls?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  updatedAt?: string;
};

export type CreatePlacePayload = {
  name: string;
  type: PlaceApiType;
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  avgPrice?: number;
  imageUrls?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
};

export const PLACE_TYPE_OPTIONS: Array<PlaceType | "全部"> = [
  "全部",
  "景點",
  "自然",
  "文化",
  "餐飲",
  "住宿",
];

export function mapBackendTypeToUi(type: PlaceApiType): PlaceType {
  switch (type) {
    case "SCENIC_SPOT":
      return "景點";
    case "NATURAL":
      return "自然";
    case "CULTURE":
      return "文化";
    case "FOOD":
      return "餐飲";
    case "HOTEL":
      return "住宿";
    default:
      return "景點";
  }
}

export function mapUiTypeToBackend(type: PlaceType | "全部"): PlaceApiType | null {
  switch (type) {
    case "景點":
      return "SCENIC_SPOT";
    case "自然":
      return "NATURAL";
    case "文化":
      return "CULTURE";
    case "餐飲":
      return "FOOD";
    case "住宿":
      return "HOTEL";
    default:
      return null;
  }
}

export function toPlaceRow(item: PlaceApiItem): PlaceRow {
  return {
    id: item.id,
    name: item.name,
    type: mapBackendTypeToUi(item.type),
    location: item.address ?? "",
    status: "published",
    updatedAt: item.updatedAt
      ? item.updatedAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}