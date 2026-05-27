import { useEffect, useReducer, useRef } from "react";

type KnowledgeData = {
  found: boolean;
  title?: string;
  shortIntro?: string;
  arGlbPath?: string;
  arUsdzPath?: string;
  tags?: string[];
  relatedItems?: { className: string; title: string }[];
};

type Props = {
  className: string;
  confidence: number;
  deviceType: "ios" | "android";
  onARModelReady: (glb: string, usdz: string) => void;
};

type State = {
  data: KnowledgeData | null;
  loading: boolean;
  expanded: boolean;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: KnowledgeData }
  | { type: "FETCH_ERROR" }
  | { type: "TOGGLE_EXPAND" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { data: null, loading: true, expanded: false };
    case "FETCH_SUCCESS":
      return { ...state, data: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "TOGGLE_EXPAND":
      return { ...state, expanded: !state.expanded };
    default:
      return state;
  }
}

export default function KnowledgeCard({
  className,
  confidence,
  deviceType,
  onARModelReady,
}: Props) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    expanded: false,
  });

  const onARModelReadyRef = useRef(onARModelReady);
  useEffect(() => {
    onARModelReadyRef.current = onARModelReady;
  }, [onARModelReady]);

  useEffect(() => {
    if (!className) return;

    dispatch({ type: "FETCH_START" });
    let cancelled = false;

    fetch("/api/detection/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className, confidence, locale: "zh-TW", deviceType }),
    })
      .then((r) => r.json())
      .then((d: KnowledgeData) => {
        if (cancelled) return;
        dispatch({ type: "FETCH_SUCCESS", payload: d });
        
        if (d.arGlbPath && d.arUsdzPath) {
          onARModelReadyRef.current(d.arGlbPath, d.arUsdzPath);
        }
      })
      .catch((err) => {
        console.error("卡片載入失敗:", err);
        if (!cancelled) dispatch({ type: "FETCH_ERROR" });
      });

    return () => {
      cancelled = true;
    };
  }, [className, confidence, deviceType]);

  const { data, loading } = state;

  if (!data && !loading) return null;

  return (
    <div className="w-full rounded-[24px] border border-gray-100 bg-white/95 p-6 shadow-sm backdrop-blur-xl">
      {loading && (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--app-accent)]" />
          <span className="text-sm font-bold text-gray-500">
            正在查詢產物知識...
          </span>
        </div>
      )}

      {!loading && data && (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>
                AI 辨識結果 · {Math.round(confidence * 100)}% 信心度
              </p>
              <h3 className="mt-1.5 text-xl font-black text-gray-800">{data.title ?? "未知物件"}</h3>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-500">
              {data.found ? "已收錄" : "未收錄"}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {data.shortIntro}
          </p>

          {data.tags && data.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                    color: "var(--app-accent)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}