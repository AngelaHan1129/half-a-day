import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import KnowledgeCard from "./KnowledgeCard";

type DetectionPhase = "idle" | "detecting" | "detected" | "knowledgeReady";

type DetectionResult = {
  className: string;
  confidence: number;
  bbox?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

const getDeviceType = (): "ios" | "android" => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) ? "ios" : "android";
};

const DEFAULT_MODEL = {
  glb: "/models/free_bamboo_set.glb",
  usdz: "/models/Free_Bamboo_Set.usdz",
  alt: "小半天特色",
};

type ModelViewerProps = {
  src: string;
  alt: string;
  "ios-src"?: string;
  ar?: boolean;
  "ar-modes"?: string;
  reveal?: string;
  style?: CSSProperties;
};

export default function ARPlantVisualizer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectIntervalRef = useRef<number | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [phase, setPhase] = useState<DetectionPhase>("idle");
  const [activeModel, setActiveModel] = useState(DEFAULT_MODEL);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [modelLoaded] = useState(true);
  const isDetectingRef = useRef(false);

  const deviceType = getDeviceType();

  useEffect(() => {
    const existing = document.querySelector('script[data-model-viewer="true"]');
    if (existing) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.setAttribute("data-model-viewer", "true");
    document.head.appendChild(script);
  }, []);

  async function captureAndDetect() {
  if (isDetectingRef.current) return;
  if (!videoRef.current) return;

  const video = videoRef.current;
  if (!video.videoWidth || !video.videoHeight) return;

  isDetectingRef.current = true;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    const res = await fetch("http://localhost:8001/api/detect", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Detect API failed: ${res.status}`);
    }

    const data = await res.json();

    if (data.topDetection) {
      setDetection({
        className: data.topDetection.className,
        confidence: data.topDetection.confidence,
        bbox: data.topDetection.bbox,
      });
      setPhase("detected");
    } else {
      setDetection(null);
      setPhase("detecting");
    }
  } catch (error) {
    console.error("detect api error:", error);
  } finally {
    isDetectingRef.current = false;
  }
}

  async function handleStartCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setPhase("detecting");

      detectIntervalRef.current = window.setInterval(() => {
        captureAndDetect();
      }, 3000);
    } catch (err) {
      console.error("[Camera Error]", err);
      alert("無法開啟相機，請確認已授予瀏覽器權限或關閉佔用鏡頭的程式。");
    }
  }

  function handleStopCamera() {
    if (detectIntervalRef.current) {
      window.clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }

    setCameraActive(false);
    setPhase("idle");
    setDetection(null);
    setActiveModel(DEFAULT_MODEL);
  }

  function handleARModelReady(glb: string, usdz: string) {
    setActiveModel({
      glb,
      usdz,
      alt: detection?.className ?? "小半天特色",
    });
    setPhase("knowledgeReady");
  }

  useEffect(() => {
    return () => {
      if (detectIntervalRef.current) {
        window.clearInterval(detectIntervalRef.current);
      }

      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  const modelViewer = React.createElement(
    "model-viewer",
    {
      src: activeModel.glb,
      "ios-src": activeModel.usdz,
      alt: activeModel.alt,
      ar: true,
      "ar-modes": "webxr scene-viewer quick-look",
      reveal: "manual",
      style: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 30,
        pointerEvents: "none",
        backgroundColor: "transparent",
      } as CSSProperties,
    } as ModelViewerProps,
    phase === "knowledgeReady"
      ? React.createElement(
          "button",
          {
            slot: "ar-button",
            className:
              "absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/90 border border-gray-100 px-6 py-3 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 pointer-events-auto",
            style: {
              color: "var(--app-accent)",
              borderColor: "var(--app-accent)",
            },
          },
          "✨ 進入 AR 空間"
        )
      : null
  );

  return (
    <div
      className="mx-auto flex w-full flex-col overflow-hidden rounded-[32px] bg-white border border-gray-200/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] md:rounded-[40px]"
      style={{ height: "80vh", minHeight: "600px", maxHeight: "850px" }}
    >
      <div className="relative flex-1 w-full overflow-hidden bg-gray-50">
        {!cameraActive && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `
                radial-gradient(circle at top left, color-mix(in srgb, var(--app-accent) 8%, transparent) 0%, transparent 40%),
                linear-gradient(180deg, white 0%, color-mix(in srgb, var(--app-accent) 4%, white) 100%)
              `,
            }}
          />
        )}

        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: cameraActive ? 1 : 0 }}
            muted
            playsInline
          />
        </div>

        {modelViewer}

        <div className="absolute left-1/2 top-6 z-40 -translate-x-1/2 pointer-events-none transition-all duration-300">
          <div className="flex items-center gap-2.5 rounded-full border border-gray-100 bg-white/95 px-5 py-2.5 backdrop-blur-md shadow-sm">
            {phase === "detecting" && (
              <div
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--app-accent)" }}
              />
            )}
            <p
              className="text-sm font-bold tracking-widest"
              style={{ color: "var(--app-accent)" }}
            >
              {phase === "idle" && "待機中"}
              {phase === "detecting" && "掃描環境中..."}
              {phase === "detected" && "發現物件"}
              {phase === "knowledgeReady" && "準備就緒"}
            </p>
          </div>
        </div>

        {phase === "detecting" && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="h-64 w-64 md:h-80 md:w-80 rounded-3xl border-[2px] border-white/80 opacity-80 animate-pulse shadow-[0_0_0_999px_rgba(0,0,0,0.2)]" />
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 z-40 flex flex-col items-center justify-end pointer-events-none">
          {detection && (
            <div className="w-full max-w-lg pointer-events-auto transition-all duration-500 transform translate-y-0 opacity-100 overflow-y-auto max-h-[40vh] rounded-[24px] hide-scrollbar shadow-2xl">
              <KnowledgeCard
                className={detection.className}
                confidence={detection.confidence}
                deviceType={deviceType}
                onARModelReady={handleARModelReady}
              />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-between gap-4 border-t border-gray-100 bg-white px-6 py-5 md:px-8 md:py-6">
        <div className="text-left">
          <h3 className="text-base font-black text-gray-800">
            {cameraActive ? "AI 系統掃描中" : "小半天特色探索"}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-400">
            {cameraActive
              ? "將鏡頭對準特色物件以辨識"
              : `YOLO 引擎${modelLoaded ? "已就緒" : "初始化中"} · 點擊啟動相機`}
          </p>
        </div>

        <button
          onClick={cameraActive ? handleStopCamera : handleStartCamera}
          className="shrink-0 rounded-full px-8 py-3.5 text-sm font-bold tracking-widest text-white transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          style={{
            backgroundColor: cameraActive ? "#ef4444" : "var(--app-accent)",
          }}
        >
          {cameraActive ? "停止掃描" : "開始辨識"}
        </button>
      </div>
    </div>
  );
}