import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useObjectDetection } from "../../hooks/useObjectDetection";
import KnowledgeCard from "./KnowledgeCard";

type DetectionPhase = "idle" | "detecting" | "detected" | "knowledgeReady";

// 裝置判斷 (用於決定原生 AR 啟動時讀取 glb 或 usdz 格式)
const getDeviceType = (): "ios" | "android" => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) ? "ios" : "android";
};

// 預設靜態模型（未辨識時背景顯示之裝飾，可依需求更換）
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
  const [cameraActive, setCameraActive] = useState(false);
  const [phase, setPhase] = useState<DetectionPhase>("idle");
  const [activeModel, setActiveModel] = useState(DEFAULT_MODEL);
  const deviceType = getDeviceType();

  // 引入偵測 Hook
  const { detection, modelLoaded, startDetection, stopDetection } =
    useObjectDetection(videoRef as React.RefObject<HTMLVideoElement>);

  // 動態載入 Google <model-viewer> 腳本
  useEffect(() => {
    const existing = document.querySelector('script[data-model-viewer="true"]');
    if (existing) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.setAttribute("data-model-viewer", "true");
    document.head.appendChild(script);
  }, []);

  // 啟動相機鏡頭
  async function handleStartCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setPhase("detecting");
      startDetection();
    } catch (err) {
      console.error("[Camera Error]", err);
      alert("無法開啟相機，請確認已授予瀏覽器權限或關閉佔用鏡頭的程式。");
    }
  }

  // 關閉相機鏡頭
  function handleStopCamera() {
    stopDetection();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setCameraActive(false);
    setPhase("idle");
  }

  // 接收後端拋出的實體模型路徑並變更 activeModel 狀態
  function handleARModelReady(glb: string, usdz: string) {
    setActiveModel({ glb, usdz, alt: detection?.className ?? "小半天特色" });
    setPhase("knowledgeReady");
  }

  // 隱藏式 AR 啟動介面 (reveal="manual")，純粹用於呼叫原生空間按鈕
  const modelViewer = React.createElement(
    "model-viewer",
    {
      src: activeModel.glb,
      "ios-src": activeModel.usdz,
      alt: activeModel.alt,
      ar: true,
      "ar-modes": "webxr scene-viewer quick-look",
      reveal: "manual",
      style: { width: "100%", height: "100%", position: "absolute", zIndex: 30, pointerEvents: "none", backgroundColor: "transparent" } as CSSProperties,
    } as ModelViewerProps,
    phase === "knowledgeReady"
      ? React.createElement(
          "button",
          {
            slot: "ar-button",
            className: "absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/90 border border-gray-100 px-6 py-3 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 pointer-events-auto",
            style: { color: "var(--app-accent)", borderColor: "var(--app-accent)" },
          },
          "✨ 進入 AR 空間"
        )
      : null
  );

  return (
    // 🌟 主容器：限制最大寬度 (680px) 的直式視窗排版，消除橫向長方形的突兀感
    <div 
      className="mx-auto flex w-full flex-col overflow-hidden rounded-[32px] bg-white border border-gray-200/80 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] md:rounded-[40px]"
      style={{ height: '80vh', minHeight: '600px', maxHeight: '850px' }}
    >
      {/* 🟢 上半部：沈浸式影像與卡片感應區 */}
      <div className="relative flex-1 w-full overflow-hidden bg-gray-50">
        
        {/* 待機時的漸層底色 */}
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

        {/* 視訊串流節點 */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: cameraActive ? 1 : 0 }}
            muted
            playsInline
          />
        </div>

        {/* 插入 WebComponent 啟動器 */}
        {modelViewer}

        {/* 頂部動態狀態膠囊 (宛如 iOS 動態島，精緻不擋視線) */}
        <div className="absolute left-1/2 top-6 z-40 -translate-x-1/2 pointer-events-none transition-all duration-300">
          <div className="flex items-center gap-2.5 rounded-full border border-gray-100 bg-white/95 px-5 py-2.5 backdrop-blur-md shadow-sm">
            {phase === "detecting" && <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />}
            <p className="text-sm font-bold tracking-widest" style={{ color: "var(--app-accent)" }}>
              {phase === "idle" && "待機中"}
              {phase === "detecting" && "掃描環境中..."}
              {phase === "detected" && "發現物件"}
              {phase === "knowledgeReady" && "準備就緒"}
            </p>
          </div>
        </div>

        {/* 畫面中央辨識對焦框 (動態呼吸燈) */}
        {phase === "detecting" && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="h-64 w-64 md:h-80 md:w-80 rounded-3xl border-[2px] border-white/80 opacity-80 animate-pulse shadow-[0_0_0_999px_rgba(0,0,0,0.2)]" />
          </div>
        )}

        {/* 浮動知識卡片放置區 (完美懸浮於相機底部) */}
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

      {/* 🟢 下半部：完全獨立、絕不擋住視訊畫面的操作底盤 */}
      <div className="shrink-0 flex items-center justify-between gap-4 border-t border-gray-100 bg-white px-6 py-5 md:px-8 md:py-6">
        <div className="text-left">
          <h3 className="text-base font-black text-gray-800">
             {cameraActive ? "AI 系統掃描中" : "小半天特色探索"}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-400">
             {cameraActive ? "將鏡頭對準特色物件以辨識" : `YOLO 引擎${modelLoaded ? "已就緒" : "初始化中"} · 點擊啟動相機`}
          </p>
        </div>
        
        <button
          onClick={cameraActive ? handleStopCamera : handleStartCamera}
          className="shrink-0 rounded-full px-8 py-3.5 text-sm font-bold tracking-widest text-white transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          style={{ backgroundColor: cameraActive ? "#ef4444" : "var(--app-accent)" }}
        >
          {cameraActive ? "停止掃描" : "開始辨識"}
        </button>
      </div>
    </div>
  );
}