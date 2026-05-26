import {
  mapCwaLocationToScene,
  type CwaLocation as CwaMappedLocation,
  type CwaSceneResult,
} from "../utils/cwaMapper";

type FetchCwaSceneOptions = {
  apiKey?: string;
  datasetId?: string;
  locationName?: string;
  countyName?: string;
};

type CwaApiLocation = CwaMappedLocation & {
  locationName?: string;
  LocationName?: string;
  weatherElement?: unknown[];
  WeatherElement?: unknown[];
};

type CwaApiLocationBlock = {
  locationsName?: string;
  LocationsName?: string;
  location?: CwaApiLocation[];
  Location?: CwaApiLocation[];
};

type CwaApiResponse = {
  success?: string;
  records?: {
    locations?: CwaApiLocationBlock[];
    Locations?: CwaApiLocationBlock[];
  };
  error?: {
    message?: string;
  };
};

const DEFAULT_DATASET_ID = "F-D0047-023";
const DEFAULT_LOCATION_NAME = "鹿谷鄉";
const DEFAULT_COUNTY_NAME = "南投縣";

export async function fetchCwaScene(
  options: FetchCwaSceneOptions = {}
): Promise<CwaSceneResult> {
  const apiKey = options.apiKey ?? import.meta.env.VITE_CWA_API_KEY;
  const datasetId = options.datasetId ?? DEFAULT_DATASET_ID;
  const locationName = options.locationName ?? DEFAULT_LOCATION_NAME;
  const countyName = options.countyName ?? DEFAULT_COUNTY_NAME;

  if (!apiKey) {
    throw new Error("缺少 VITE_CWA_API_KEY，請先在 .env 設定 CWA API 金鑰");
  }

  const url = new URL(
    `/api/cwa/v1/rest/datastore/${datasetId}`,
    window.location.origin
  );
  url.searchParams.set("Authorization", apiKey);
  url.searchParams.set("format", "JSON");
  url.searchParams.set("LocationName", locationName);

  const response = await fetch(url.toString(), { method: "GET" });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `CWA API request failed: ${response.status} ${text.slice(0, 160)}`
    );
  }

  const json: unknown = await response.json();
  const data = json as CwaApiResponse;

  const locationBlocks =
    data.records?.Locations ?? data.records?.locations ?? [];

  if (!locationBlocks.length) {
    throw new Error(
      `CWA API 有回應，但找不到 records.Locations / records.locations。raw=${JSON.stringify(json).slice(0, 300)}`
    );
  }

  const locationsBlock = locationBlocks[0];

  const locationsName =
    locationsBlock.LocationsName ??
    locationsBlock.locationsName ??
    "";

  const locations =
    locationsBlock.Location ??
    locationsBlock.location ??
    [];

  const getLocationName = (item: CwaApiLocation): string =>
    item.LocationName ?? item.locationName ?? "";

  if (locationsName && !locationsName.includes(countyName)) {
    throw new Error(
      `CWA 資料集縣市不符：目前是 ${locationsName}，但你要的是 ${countyName}`
    );
  }

  if (!locations.length) {
    throw new Error(
      `CWA API 有回應，但 ${datasetId} 沒有 Location/location 資料；locationsName=${locationsName || "unknown"}`
    );
  }

  const normalizedTarget = locationName.trim();

  const targetLocation =
    locations.find(
      (item) => getLocationName(item).trim() === normalizedTarget
    ) ??
    locations.find((item) =>
      getLocationName(item).includes(normalizedTarget)
    );

  if (!targetLocation) {
    const availableNames = locations
      .map((item) => getLocationName(item))
      .filter(Boolean);

    throw new Error(
      `找不到 ${locationName} 的 CWA 天氣資料。locations.length=${locations.length}；可用鄉鎮=${JSON.stringify(availableNames)}`
    );
  }

  const mapped = mapCwaLocationToScene(targetLocation, countyName);
  console.log("mapped scene =", mapped);
  return mapped;
}