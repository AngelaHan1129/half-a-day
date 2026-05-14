import React, { useEffect } from "react";
import type { CSSProperties } from "react";

type ModelViewerProps = {
  src: string;
  alt: string;
  "ios-src"?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "camera-controls"?: boolean;
  autoplay?: boolean;
  exposure?: string;
  poster?: string;
  "shadow-intensity"?: string;
  "environment-image"?: string;
  "interaction-prompt"?: string;
  style?: CSSProperties;
};

export default function ARPlantVisualizer() {
  useEffect(() => {
    const existing = document.querySelector(
      'script[data-model-viewer="true"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.setAttribute("data-model-viewer", "true");
    document.head.appendChild(script);
  }, []);

  const modelViewer = React.createElement("model-viewer", {
    src: "/models/free_bamboo_set.glb",
    "ios-src": "/models/Free_Bamboo_Set.usdz",
    alt: "竹林植物 AR 3D 模型",
    ar: true,
    "ar-modes": "webxr scene-viewer quick-look fallback",
    "camera-controls": true,
    autoplay: true,
    "shadow-intensity": "1",
    "interaction-prompt": "auto",
    style: {
      width: "100%",
      height: "100%",
      background: "transparent",
    } as CSSProperties,
  } as ModelViewerProps);

  return (
    <div
      className="relative h-[75vh] min-h-[560px] w-full overflow-hidden rounded-[32px] border transition-colors duration-300"
      style={{
        borderColor: "var(--app-border)",
        background: `
          radial-gradient(
            circle at top left,
            color-mix(in srgb, var(--app-accent) 16%, transparent) 0%,
            transparent 30%
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--app-card) 92%, var(--app-bg)) 0%,
            color-mix(in srgb, var(--app-bg) 96%, black 4%) 100%
          )
        `,
        boxShadow: "var(--app-shadow)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, white 10%, transparent) 0%, transparent 35%, color-mix(in srgb, black 8%, transparent) 100%)",
        }}
      />

      <div
        className="absolute left-6 top-6 z-10 max-w-md rounded-2xl border p-4 backdrop-blur-md transition-colors duration-300"
        style={{
          borderColor: "color-mix(in srgb, var(--app-border) 85%, transparent)",
          background: "color-mix(in srgb, var(--app-card) 72%, transparent)",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <p
          className="text-sm uppercase tracking-[0.24em]"
          style={{ color: "var(--app-accent)" }}
        >
          Cross-platform AR
        </p>

        <h2 className="mt-2 text-2xl font-black md:text-3xl">
          Android / iPhone 都可開啟 AR
        </h2>

        <p
          className="mt-3 text-sm leading-7"
          style={{ color: "var(--app-text-muted)" }}
        >
          Android 會優先使用 WebXR 或 Scene Viewer；iPhone Safari 會使用 AR Quick
          Look。若裝置不支援，則退回 3D 模型預覽。
        </p>
      </div>

      {modelViewer}

      <div
        className="absolute bottom-6 left-6 z-10 rounded-2xl border px-4 py-3 text-sm backdrop-blur-md transition-colors duration-300"
        style={{
          borderColor: "color-mix(in srgb, var(--app-border) 85%, transparent)",
          background: "color-mix(in srgb, var(--app-card) 72%, transparent)",
          color: "var(--app-text-muted)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        iPhone 請使用 Safari；Android 請使用 Chrome。
      </div>
    </div>
  );
}