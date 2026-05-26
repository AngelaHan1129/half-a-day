// src/utils/cwaMapper.ts

export type TimePhase = "dawn" | "day" | "dusk" | "night";
export type WeatherMood = "sunny" | "cloudy" | "rainy";
export type MoonPhase = "new" | "crescent" | "half" | "gibbous" | "full";

export type SceneState = {
  timePhase: TimePhase;
  weatherMood: WeatherMood;
  moonPhase: MoonPhase;
};

export type SceneMeta = {
  countyName: string;
  locationName: string;
  weatherText: string;
  weatherCode: string;
  pop: number;
  startTime: string;
  endTime: string;
  rawWxElementName: string;
  rawPopElementName: string;
};

export type CwaSceneResult = {
  sceneState: SceneState;
  sceneMeta: SceneMeta;
};

export type CwaElementValue = {
  value?: string;
  Value?: string;
  measures?: string;
  Measures?: string;
  weather?: string;
  Weather?: string;
  Temperature?: string;
  DewPoint?: string;
  MaxTemperature?: string;
  MinTemperature?: string;
  RelativeHumidity?: string;
  MaxApparentTemperature?: string;
  MinApparentTemperature?: string;
  ApparentTemperature?: string;
  MaxComfortIndex?: string;
  MaxComfortIndexDescription?: string;
  MinComfortIndex?: string;
  MinComfortIndexDescription?: string;
  ComfortIndex?: string;
  ComfortIndexDescription?: string;
  WindDirection?: string;
  WindSpeed?: string;
  BeaufortScale?: string;
  ProbabilityOfPrecipitation?: string;
  UVIndex?: string;
  UVExposureLevel?: string;
  WeatherCode?: string;
  WeatherDescription?: string;
  [key: string]: unknown;
};

export type CwaTimeNode = {
  startTime?: string;
  StartTime?: string;
  endTime?: string;
  EndTime?: string;
  stopTime?: string;
  StopTime?: string;
  dataTime?: string;
  DataTime?: string;
  elementValue?: CwaElementValue[];
  ElementValue?: CwaElementValue[];
  [key: string]: unknown;
};

export type CwaWeatherElement = {
  elementName?: string;
  ElementName?: string;
  description?: string;
  Description?: string;
  time?: CwaTimeNode[];
  Time?: CwaTimeNode[];
  [key: string]: unknown;
};

export type CwaLocation = {
  locationName?: string;
  LocationName?: string;
  weatherElement?: CwaWeatherElement[];
  WeatherElement?: CwaWeatherElement[];
  [key: string]: unknown;
};

function getLocationName(location: CwaLocation): string {
  return location.LocationName ?? location.locationName ?? "";
}

function getWeatherElements(location: CwaLocation): CwaWeatherElement[] {
  return location.WeatherElement ?? location.weatherElement ?? [];
}

function getElementName(element?: CwaWeatherElement): string {
  if (!element) return "";
  return element.ElementName ?? element.elementName ?? "";
}

function getTimes(element?: CwaWeatherElement): CwaTimeNode[] {
  if (!element) return [];
  return element.Time ?? element.time ?? [];
}

function getElementValues(timeNode?: CwaTimeNode): CwaElementValue[] {
  if (!timeNode) return [];
  return timeNode.ElementValue ?? timeNode.elementValue ?? [];
}

function getStartTime(timeNode?: CwaTimeNode): string {
  if (!timeNode) return "";
  return (
    timeNode.StartTime ??
    timeNode.startTime ??
    timeNode.DataTime ??
    timeNode.dataTime ??
    ""
  );
}

function getEndTime(timeNode?: CwaTimeNode): string {
  if (!timeNode) return "";
  return (
    timeNode.EndTime ??
    timeNode.endTime ??
    timeNode.StopTime ??
    timeNode.stopTime ??
    timeNode.DataTime ??
    timeNode.dataTime ??
    ""
  );
}

function parseNumber(input?: string): number {
  const n = Number(input ?? "");
  return Number.isFinite(n) ? n : 0;
}

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function getStringRecordEntries(obj: Record<string, unknown>): Array<[string, string]> {
  return Object.entries(obj)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => [key, String(value)]);
}

function findValueByKeyIncludes(
  obj: Record<string, unknown>,
  keywords: string[]
): string {
  for (const [key, value] of getStringRecordEntries(obj)) {
    if (keywords.some((keyword) => key.includes(keyword)) && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function extractNumericFromUnknownText(input: string): string {
  const match = input.match(/\d{1,3}/);
  return match?.[0] ?? "";
}

function getElementValuePrimary(value: CwaElementValue): string {
  const direct = firstNonEmpty(
    value.value as string | undefined,
    value.Value as string | undefined,
    value.Weather as string | undefined,
    value.weather as string | undefined,
    value.WeatherDescription as string | undefined,
    value.ProbabilityOfPrecipitation as string | undefined,
    value.WeatherCode as string | undefined,
    value.Temperature as string | undefined,
    value.ApparentTemperature as string | undefined,
    value.MaxTemperature as string | undefined,
    value.MinTemperature as string | undefined,
    value.RelativeHumidity as string | undefined,
    value.WindSpeed as string | undefined,
    value.UVIndex as string | undefined
  );

  if (direct) return direct;

  return (
    findValueByKeyIncludes(value as Record<string, unknown>, [
      "Weather",
      "Description",
      "Precipitation",
      "Temperature",
      "Humidity",
      "Wind",
      "UV",
      "降雨",
      "天氣",
      "溫度",
      "濕度",
      "風",
      "紫外線",
    ]) || ""
  );
}

export function getTimePhase(now = new Date()): TimePhase {
  const hour = now.getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "dusk";
  return "night";
}

export function getMockMoonPhase(now = new Date()): MoonPhase {
  const day = now.getDate();
  if (day <= 2 || day >= 29) return "new";
  if (day <= 7) return "crescent";
  if (day <= 15) return "half";
  if (day <= 23) return "gibbous";
  return "full";
}

export function mapWeatherCodeToMood(
  weatherCode?: string,
  weatherText?: string,
  pop?: number
): WeatherMood {
  const code = parseNumber(weatherCode);
  const text = String(weatherText ?? "");
  const rainProb = Number(pop ?? 0);

  if (
    code >= 8 ||
    text.includes("雨") ||
    text.includes("雷") ||
    text.includes("陣雨") ||
    text.includes("雷雨") ||
    rainProb >= 50
  ) {
    return "rainy";
  }

  if (
    (code >= 4 && code <= 7) ||
    text.includes("陰") ||
    text.includes("雲")
  ) {
    return "cloudy";
  }

  return "sunny";
}

export function getSceneSummary(sceneState: SceneState): string {
  const phaseMap: Record<TimePhase, string> = {
    dawn: "清晨",
    day: "白天",
    dusk: "黃昏",
    night: "夜晚",
  };

  const weatherMap: Record<WeatherMood, string> = {
    sunny: "晴",
    cloudy: "陰",
    rainy: "雨",
  };

  const moonMap: Record<MoonPhase, string> = {
    new: "新月",
    crescent: "眉月",
    half: "半月",
    gibbous: "凸月",
    full: "滿月",
  };

  return `${phaseMap[sceneState.timePhase]}・${weatherMap[sceneState.weatherMood]}${
    sceneState.timePhase === "night" ? `・${moonMap[sceneState.moonPhase]}` : ""
  }`;
}

export function pickCurrentTimeBlock(times: CwaTimeNode[] = []): CwaTimeNode | undefined {
  const now = Date.now();

  return (
    times.find((item) => {
      const start = new Date(getStartTime(item)).getTime();
      const end = new Date(getEndTime(item)).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
      return now >= start && now <= end;
    }) ?? times[0]
  );
}

export function findWeatherElement(
  elements: CwaWeatherElement[],
  names: string[]
): CwaWeatherElement | undefined {
  return elements.find((el) => names.includes(getElementName(el)));
}

export function extractElementPrimaryValue(timeNode?: CwaTimeNode): string {
  const values = getElementValues(timeNode);
  if (!values.length) return "";
  return getElementValuePrimary(values[0]);
}

export function extractWeatherText(timeNode?: CwaTimeNode): string {
  const values = getElementValues(timeNode);
  if (!values.length) return "";

  for (const item of values) {
    const direct = firstNonEmpty(
      item.Weather as string | undefined,
      item.weather as string | undefined,
      item.WeatherDescription as string | undefined,
      item.value as string | undefined,
      item.Value as string | undefined
    );
    if (direct) return direct;

    const scanned = findValueByKeyIncludes(item as Record<string, unknown>, [
      "WeatherDescription",
      "Weather",
      "description",
      "描述",
      "天氣",
      "現象",
    ]);
    if (scanned) return scanned;
  }

  return "";
}

export function extractWeatherCode(timeNode?: CwaTimeNode): string {
  const values = getElementValues(timeNode);
  if (!values.length) return "";

  for (const item of values) {
    const direct = firstNonEmpty(
      item.WeatherCode as string | undefined,
      item.value as string | undefined,
      item.Value as string | undefined
    );
    if (/^\d{1,2}$/.test(direct)) return direct;

    const scanned = findValueByKeyIncludes(item as Record<string, unknown>, [
      "WeatherCode",
      "天氣代碼",
      "代碼",
    ]);
    if (/^\d{1,2}$/.test(scanned)) return scanned;
  }

  return "";
}

export function extractPoP(timeNode?: CwaTimeNode): number {
  const values = getElementValues(timeNode);
  if (!values.length) return 0;

  for (const item of values) {
    const direct = firstNonEmpty(
      item.ProbabilityOfPrecipitation as string | undefined,
      item.value as string | undefined,
      item.Value as string | undefined
    );
    if (/^\d{1,3}$/.test(direct)) return parseNumber(direct);

    const scanned = findValueByKeyIncludes(item as Record<string, unknown>, [
      "ProbabilityOfPrecipitation",
      "Precipitation",
      "PoP",
      "降雨機率",
      "降雨",
    ]);
    if (/^\d{1,3}$/.test(scanned)) return parseNumber(scanned);

    const fallbackText = getElementValuePrimary(item);
    const numeric = extractNumericFromUnknownText(fallbackText);
    if (/^\d{1,3}$/.test(numeric)) return parseNumber(numeric);
  }

  return 0;
}

export function mapCwaLocationToScene(
  location: CwaLocation,
  countyName = "南投縣"
): CwaSceneResult {
  const weatherElements = getWeatherElements(location);

  const wxElement =
    findWeatherElement(weatherElements, ["Wx", "Weather", "天氣現象"]) ??
    weatherElements.find((el) => {
      const name = getElementName(el);
      return name === "Wx" || name.includes("天氣現象") || name.includes("Weather");
    });

  const popElement =
    findWeatherElement(weatherElements, [
      "PoP12h",
      "PoP6h",
      "PoP3h",
      "ProbabilityOfPrecipitation",
      "12小時降雨機率",
      "3小時降雨機率",
    ]) ??
    weatherElements.find((el) => {
      const name = getElementName(el);
      return name.includes("降雨機率") || name.includes("PoP");
    });

  const descriptionElement =
    findWeatherElement(weatherElements, [
      "WeatherDescription",
      "天氣預報綜合描述",
      "綜合描述",
      "天氣描述",
    ]) ??
    weatherElements.find((el) => {
      const name = getElementName(el);
      return (
        name.includes("綜合描述") ||
        name.includes("天氣描述") ||
        name.includes("WeatherDescription")
      );
    });

  const wxTime = pickCurrentTimeBlock(getTimes(wxElement));
  const popTime = pickCurrentTimeBlock(getTimes(popElement));
  const descTime = pickCurrentTimeBlock(getTimes(descriptionElement));

  const weatherText =
    extractWeatherText(wxTime) ||
    extractWeatherText(descTime) ||
    extractElementPrimaryValue(wxTime) ||
    extractElementPrimaryValue(descTime);

  const weatherCode =
    extractWeatherCode(wxTime) ||
    extractWeatherCode(descTime);

  const pop = extractPoP(popTime);

  const now = new Date();

  const sceneState: SceneState = {
    timePhase: getTimePhase(now),
    weatherMood: mapWeatherCodeToMood(weatherCode, weatherText, pop),
    moonPhase: getMockMoonPhase(now),
  };

  const sceneMeta: SceneMeta = {
    countyName,
    locationName: getLocationName(location) || "鹿谷鄉",
    weatherText: weatherText || "無資料",
    weatherCode: weatherCode || "",
    pop,
    startTime: getStartTime(wxTime || descTime),
    endTime: getEndTime(wxTime || descTime),
    rawWxElementName: getElementName(wxElement),
    rawPopElementName: getElementName(popElement),
  };

  return { sceneState, sceneMeta };
}