import { useRef, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

// 1. 定義你的小半天專屬類別 (這必須與你未來訓練 YOLO 模型時的 classes 順序完全一致)
const CUSTOM_CLASSES = [
  "bamboo",        // 0: 竹子
  "bamboo_shoot",  // 1: 竹筍
  "tea_leaf",      // 2: 茶葉
  "ginkgo",        // 3: 銀杏 (大崙山特色)
  "mushroom"       // 4: 香菇
];

// 2. 顯示用的中文名稱對應表
export const HALFADAY_CLASSES: Record<string, string> = {
  bamboo: "竹子",
  bamboo_shoot: "竹筍",
  tea_leaf: "茶葉",
  ginkgo: "銀杏",
  mushroom: "香菇",
};

export type DetectionResult = {
  className: string;
  chineseName: string;
  confidence: number;
  bbox: [number, number, number, number]; // cx, cy, w, h (normalized)
};

// ---- 解析 YOLO output [1, 4 + numClasses, 2100] ----
function parseYOLOOutput(
  rawData: Float32Array,
  threshold = 0.45 // 建議稍微調高閥值，減少誤判
): DetectionResult[] {
  const numBoxes = 2100;
  // 動態取得自定義類別數量 (取代原本寫死的 80)
  const numClasses = CUSTOM_CLASSES.length; 
  const results: DetectionResult[] = [];

  for (let i = 0; i < numBoxes; i++) {
    // 找最大 class score
    let maxScore = 0;
    let maxClass = 0;
    for (let c = 0; c < numClasses; c++) {
      // YOLOv8/11 的 tensor 排列方式：前 4 個是 bbox，後面是各類別的信心度
      const score = rawData[(4 + c) * numBoxes + i];
      if (score > maxScore) {
        maxScore = score;
        maxClass = c;
      }
    }

    if (maxScore < threshold) continue;

    const cx = rawData[0 * numBoxes + i];
    const cy = rawData[1 * numBoxes + i];
    const w  = rawData[2 * numBoxes + i];
    const h  = rawData[3 * numBoxes + i];

    const className = CUSTOM_CLASSES[maxClass] ?? `class_${maxClass}`;

    results.push({
      className,
      chineseName: HALFADAY_CLASSES[className] ?? className,
      confidence: maxScore,
      bbox: [cx, cy, w, h],
    });
  }

  // 依 confidence 排序，只取最高的
  results.sort((a, b) => b.confidence - a.confidence);
  return results.slice(0, 3);
}

// ---- Hook ----
export function useObjectDetection(
  videoRef: React.RefObject<HTMLVideoElement>
) {
  const modelRef = useRef<tf.GraphModel | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  // 載入模型
  const ensureModel = useCallback(async () => {
    if (modelRef.current) return true;
    try {
      // 確保這裡的路徑是你未來放置「自定義模型」的地方
      modelRef.current = await tf.loadGraphModel(
        "/yolo11n_custom_web_model/model.json" 
      );
      setModelLoaded(true);
      console.log("[YOLO] Custom Model loaded");
      return true;
    } catch (err) {
      console.error("[YOLO] Model load failed:", err);
      return false;
    }
  }, []);

  // 單幀推論
  const runInference = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !modelRef.current || video.readyState < 2) return;

    const result = tf.tidy(() => {
      const frame = tf.browser.fromPixels(video);
      const input = frame
        .resizeBilinear([320, 320]) // 需與你訓練模型時的 image size 一致 (通常是 320 或 640)
        .toFloat()
        .div(255.0)
        .expandDims(0); 
      return modelRef.current!.predict(input) as tf.Tensor;
    });

    const rawData = await result.data() as Float32Array;
    result.dispose();

    const detections = parseYOLOOutput(rawData, 0.45);
    if (detections.length > 0) {
      setDetection(detections[0]);
    } else {
      setDetection(null);
    }
  }, [videoRef]);

  // 開始偵測迴圈
  const startDetection = useCallback(async () => {
    const ok = await ensureModel();
    if (!ok) return;
    runningRef.current = true;

    const loop = () => {
      if (!runningRef.current) return;
      runInference().finally(() => {
        if (runningRef.current) {
          rafRef.current = window.setTimeout(loop, 500) as unknown as number;
        }
      });
    };
    loop();
  }, [ensureModel, runInference]);

  // 停止偵測
  const stopDetection = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) clearTimeout(rafRef.current);
    setDetection(null);
  }, []);

  return { detection, modelLoaded, startDetection, stopDetection };
}