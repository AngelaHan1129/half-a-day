export type PlaceType = "景點" | "自然" | "文化" | "餐飲" | "住宿";

export type PlaceRow = {
  id: number;
  name: string;
  type: PlaceType;
  location: string;
  status: "published" | "draft";
  updatedAt: string;
};

export const placeRows: PlaceRow[] = [
  {
    id: 1,
    name: "小半天高架橋",
    type: "景點",
    location: "南投縣鹿谷鄉",
    status: "published",
    updatedAt: "2026-04-29",
  },
  {
    id: 2,
    name: "石馬公園",
    type: "文化",
    location: "南投縣鹿谷鄉",
    status: "published",
    updatedAt: "2026-04-28",
  },
  {
    id: 3,
    name: "德興瀑布",
    type: "自然",
    location: "南投縣鹿谷鄉",
    status: "draft",
    updatedAt: "2026-04-27",
  },
];

export const placeTypeOptions: Array<PlaceType | "全部"> = [
  "全部",
  "景點",
  "自然",
  "文化",
  "餐飲",
  "住宿",
];