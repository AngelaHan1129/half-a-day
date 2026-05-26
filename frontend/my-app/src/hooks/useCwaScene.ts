// src/hooks/useCwaScene.ts

import { useCallback, useEffect, useState } from "react";
import { fetchCwaScene } from "../services/cwaScene";
import type { SceneMeta, SceneState } from "../utils/cwaMapper";

type UseCwaSceneOptions = {
  autoRefreshMs?: number;
  locationName?: string;
  countyName?: string;
  datasetId?: string;
};

const defaultSceneState: SceneState = {
  timePhase: "dawn",
  weatherMood: "cloudy",
  moonPhase: "crescent",
};

const defaultSceneMeta: SceneMeta = {
  countyName: "南投縣",
  locationName: "鹿谷鄉",
  weatherText: "讀取中",
  weatherCode: "",
  pop: 0,
  startTime: "",
  endTime: "",
  rawWxElementName: "",
  rawPopElementName: "",
};

export function useCwaScene(options: UseCwaSceneOptions = {}) {
  const {
    autoRefreshMs = 10 * 60 * 1000,
    locationName = "鹿谷鄉",
    countyName = "南投縣",
    datasetId = "F-D0047-023",
  } = options;

  const [sceneState, setSceneState] = useState<SceneState>(defaultSceneState);
  const [sceneMeta, setSceneMeta] = useState<SceneMeta>(defaultSceneMeta);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchCwaScene({
        datasetId,
        locationName,
        countyName,
      });

      setSceneState(result.sceneState);
      setSceneMeta(result.sceneMeta);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "讀取 CWA 天氣失敗");
    } finally {
      setLoading(false);
    }
  }, [countyName, datasetId, locationName]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetchCwaScene({
          datasetId,
          locationName,
          countyName,
        });

        if (!active) return;

        setSceneState(result.sceneState);
        setSceneMeta(result.sceneMeta);
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError(err instanceof Error ? err.message : "讀取 CWA 天氣失敗");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    const timer = window.setInterval(run, autoRefreshMs);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [autoRefreshMs, countyName, datasetId, locationName]);

  return {
    sceneState,
    sceneMeta,
    loading,
    error,
    refresh,
  };
}