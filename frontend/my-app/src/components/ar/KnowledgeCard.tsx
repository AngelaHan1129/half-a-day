import { useEffect, useReducer, useRef } from "react";
import {
  getKnowledge,
  type KnowledgeResponse,
  type RelatedItem,
} from "../../services/api/knowledgeApi";

type Props = {
  className: string;
  confidence: number;
  deviceType: "ios" | "android";
  onARModelReady: (glb: string, usdz: string) => void;
};

type State = {
  data: KnowledgeResponse | null;
  loading: boolean;
  expanded: boolean;
  error: boolean;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: KnowledgeResponse }
  | { type: "FETCH_ERROR" }
  | { type: "TOGGLE_EXPAND" };

const knowledgeCache = new Map<string, KnowledgeResponse>();

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return {
        data: null,
        loading: true,
        expanded: false,
        error: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
      };
    case "TOGGLE_EXPAND":
      return {
        ...state,
        expanded: !state.expanded,
      };
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
    error: false,
  });

  const onARModelReadyRef = useRef(onARModelReady);

  useEffect(() => {
    onARModelReadyRef.current = onARModelReady;
  }, [onARModelReady]);

  useEffect(() => {
    if (!className) return;

    const normalizedClassName = className.trim();
    if (!normalizedClassName) return;

    const cacheKey = `小半天::${normalizedClassName}`;
    const cached = knowledgeCache.get(cacheKey);

    if (cached) {
      dispatch({ type: "FETCH_SUCCESS", payload: cached });

      if (cached.arGlbPath && cached.arUsdzPath) {
        onARModelReadyRef.current(cached.arGlbPath, cached.arUsdzPath);
      }
      return;
    }

    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    getKnowledge({
      detectedClass: normalizedClassName,
      region: "小半天",
    })
      .then((data) => {
        if (cancelled) return;

        knowledgeCache.set(cacheKey, data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });

        if (data.arGlbPath && data.arUsdzPath) {
          onARModelReadyRef.current(data.arGlbPath, data.arUsdzPath);
        }
      })
      .catch((err) => {
        console.error("知識卡片載入失敗:", err);
        if (!cancelled) {
          dispatch({ type: "FETCH_ERROR" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [className]);

  const { data, loading, expanded, error } = state;
  const relatedItems: RelatedItem[] = data?.relatedItems ?? [];
  const displayTitle = data?.title ?? className ?? "未知產物";
  const displayIntro =
    data?.shortIntro ?? "目前尚無此產物在小半天的詳細介紹內容。";

  if (!data && !loading && !error) return null;
console.log("KnowledgeCard className =", className);
  return (
    <div className="w-full rounded-[24px] border border-gray-100 bg-white/95 p-6 shadow-sm backdrop-blur-xl">
      {loading && (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--app-accent)]" />
          <span className="text-sm font-bold text-gray-500">
            正在查詢小半天產物知識...
          </span>
        </div>
      )}

      {/* {!loading && error && (
        <div>
          <p className="text-sm font-bold text-red-500">知識資料載入失敗</p>
          <p className="mt-2 text-sm text-gray-500">
            請稍後再試，或確認後端 /api/knowledge 是否正常運作。
          </p>
        </div>
      )} */}

      {!loading && data && (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--app-accent)" }}
              >
                AI 辨識結果 · {Math.round(confidence * 100)}% 信心度 · {deviceType}
              </p>

              <h3 className="mt-1.5 break-words text-xl font-black text-gray-800">
                {displayTitle}
              </h3>

              <p className="mt-1 text-xs font-medium text-gray-400">
                辨識類別：{className}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-500">
              {data.found ? "已收錄" : "未收錄"}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-[color-mix(in_srgb,var(--app-accent)_6%,white)] px-4 py-3">
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--app-accent)" }}
            >
              小半天產物相關知識
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {displayIntro}
            </p>
          </div>

          {data.tags && data.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                    color: "var(--app-accent)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {relatedItems.length > 0 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_EXPAND" })}
                className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ color: "var(--app-accent)" }}
              >
                {expanded ? "收起相關特色" : "查看相關特色"}
                <span className="text-xs">{expanded ? "▲" : "▼"}</span>
              </button>

              {expanded && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedItems.map((item: RelatedItem) => (
                    <span
                      key={item.className}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700"
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {!data.found && (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              此辨識產物目前尚未建立完整的小半天知識內容，系統已先顯示辨識結果：
              {className}
            </div>
          )}

          {(data.arGlbPath || data.arUsdzPath) && (
            <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
              AR 模型資源已就緒，請使用上方按鈕進入 AR。
            </div>
          )}
        </>
      )}
    </div>
  );
}