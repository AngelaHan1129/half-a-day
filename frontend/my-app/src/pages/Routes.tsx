import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { routeApi } from "../services/api/routesApi";
import type { Route } from "../types/route";
import aboutBg from "../assets/images/about.jpg";

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [maxHours, setMaxHours] = useState("");
  const [season, setSeason] = useState("");

  const activeFilter = useMemo(() => {
    if (keyword.trim()) return `關鍵字：${keyword.trim()}`;
    if (maxHours.trim()) return `最大時數：${maxHours.trim()} 小時`;
    if (season.trim()) return `季節：${season.trim()}`;
    return "全部路線";
  }, [keyword, maxHours, season]);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        setError("");

        let data: Route[];

        if (keyword.trim()) {
          data = await routeApi.search(keyword.trim());
        } else if (maxHours.trim()) {
          data = await routeApi.getByDuration(Number(maxHours));
        } else if (season.trim()) {
          data = await routeApi.getBySeason(season.trim());
        } else {
          data = await routeApi.getAll();
        }

        setRoutes(data);
      } catch (err) {
        console.error(err);
        setError("載入路線資料失敗");
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(loadRoutes, 250);
    return () => window.clearTimeout(timer);
  }, [keyword, maxHours, season]);

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 font-sans transition-colors duration-500 md:px-8"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <style>{`
        @keyframes doodle-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes bamboo-breeze {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(2deg) skewX(-3deg); }
        }
        .hand-drawn-border {
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
        }
        .hand-drawn-border:hover {
          border-radius: 15px 255px 15px 225px / 225px 15px 255px 15px;
        }
        .bamboo-leaf-shape {
          border-radius: 20px 4px 20px 4px;
        }
        .bamboo-leaf-shape:hover {
          border-radius: 4px 20px 4px 20px;
        }
      `}</style>

      {/* 底層清楚照片 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${aboutBg}")`,
          backgroundPosition: "center right",
        }}
      />

      {/* 上層模糊照片：左邊模糊、右邊漸隱，露出下方清楚照片 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 scale-105 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${aboutBg}")`,
          backgroundPosition: "center right",
          filter: "blur(24px)",
          opacity: 0.92,
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 42%, rgba(0,0,0,0.72) 58%, transparent 82%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 42%, rgba(0,0,0,0.72) 58%, transparent 82%, transparent 100%)",
        }}
      />

      {/* 柔白霧面遮罩，確保左側文字可讀性 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(247,246,242,0.95) 0%, rgba(247,246,242,0.86) 28%, rgba(247,246,242,0.52) 56%, rgba(247,246,242,0.16) 82%, rgba(247,246,242,0.06) 100%)",
        }}
      />

      {/* 很淡的點點紋理 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--app-text) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.28,
        }}
      />

      {/* 頁面內容 */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* 標題區塊 */}
        <div className="mb-8 text-center md:text-left">
          <div
            className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-sm tracking-widest text-[var(--app-accent)]"
            style={{
              borderColor: "var(--app-border)",
              backgroundColor:
                "color-mix(in srgb, var(--app-accent) 8%, transparent)",
            }}
          >
            ✦ Route Guide
          </div>

          <h1 className="text-3xl font-black tracking-wide text-[var(--app-text)] md:text-5xl">
            遊程路線
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--app-text-muted)] md:text-lg">
            瀏覽小半天精選旅遊路線，依關鍵字、時數與季節快速篩選，找出最適合你的在地探索之旅。
          </p>
        </div>

        {/* 篩選器區塊 */}
        <div
          className="relative overflow-hidden rounded-[24px] border bg-[var(--app-surface)]/90 p-5 shadow-sm backdrop-blur-xl transition-colors duration-500"
          style={{
            borderColor: "var(--app-border)",
            boxShadow:
              "0 10px 30px color-mix(in srgb, var(--app-text) 8%, transparent)",
            backgroundColor:
              "color-mix(in srgb, var(--app-surface) 88%, white)",
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* 關鍵字搜尋 */}
            <div className="relative min-w-[240px] flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>

              <input
                type="text"
                placeholder="輸入關鍵字搜尋路線..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (e.target.value) {
                    setMaxHours("");
                    setSeason("");
                  }
                }}
                className="w-full rounded-[16px] border pl-11 pr-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={
                  {
                    borderColor: "var(--app-border)",
                    backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                    color: "var(--app-text)",
                    outlineColor: "transparent",
                    "--tw-ring-color":
                      "color-mix(in srgb, var(--app-accent) 40%, transparent)",
                  } as CSSProperties
                }
              />
            </div>

            {/* 最大時數 */}
            <div className="relative w-[140px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>

              <input
                type="number"
                placeholder="最大時數"
                value={maxHours}
                onChange={(e) => {
                  setMaxHours(e.target.value);
                  if (e.target.value) {
                    setKeyword("");
                    setSeason("");
                  }
                }}
                className="w-full rounded-[16px] border pl-11 pr-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={
                  {
                    borderColor: "var(--app-border)",
                    backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                    color: "var(--app-text)",
                    "--tw-ring-color":
                      "color-mix(in srgb, var(--app-accent) 40%, transparent)",
                  } as CSSProperties
                }
              />
            </div>

            {/* 季節 */}
            <div className="relative w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </span>

              <input
                type="text"
                placeholder="季節 (如 spring)"
                value={season}
                onChange={(e) => {
                  setSeason(e.target.value);
                  if (e.target.value) {
                    setKeyword("");
                    setMaxHours("");
                  }
                }}
                className="w-full rounded-[16px] border pl-11 pr-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={
                  {
                    borderColor: "var(--app-border)",
                    backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                    color: "var(--app-text)",
                    "--tw-ring-color":
                      "color-mix(in srgb, var(--app-accent) 40%, transparent)",
                  } as CSSProperties
                }
              />
            </div>

            {/* 清除篩選按鈕 */}
            {(keyword || maxHours || season) && (
              <button
                onClick={() => {
                  setKeyword("");
                  setMaxHours("");
                  setSeason("");
                }}
                className="bamboo-leaf-shape px-5 py-3 text-sm font-bold transition-all duration-300 hover:animate-[bamboo-breeze_4s_ease-in-out_infinite]"
                style={{
                  backgroundColor: "var(--app-accent)",
                  color: "var(--app-bg)",
                  boxShadow:
                    "0 4px 12px color-mix(in srgb, var(--app-accent) 30%, transparent)",
                }}
              >
                清除篩選 ✕
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-[var(--app-text-muted)]">
            <span className="h-[1px] w-6 bg-[var(--app-border)]"></span>
            目前條件：
            <span className="font-medium text-[var(--app-accent)]">
              {activeFilter}
            </span>
          </div>
        </div>

        {/* 狀態提示 */}
        {loading && (
          <div className="mt-12 flex flex-col items-center justify-center py-10">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
            <p className="mt-4 text-sm tracking-widest text-[var(--app-accent)]">
              正在尋找路線...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-12 rounded-[20px] border border-red-200 bg-red-50/70 p-6 text-center text-red-500 backdrop-blur-md">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && routes.length === 0 && (
          <div className="mt-12 rounded-[20px] border border-[var(--app-border)] bg-[var(--app-surface)]/85 p-12 text-center text-[var(--app-text-muted)] backdrop-blur-md">
            <p>目前查無符合條件的路線資料，請嘗試其他關鍵字或清除篩選。</p>
          </div>
        )}

        {/* 遊程路線卡片列表 */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <Link key={route.id} to={`/routes/${route.id}`} className="block outline-none">
              <article
                className="group hand-drawn-border relative flex h-full flex-col border-2 p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl"
                style={{
                  borderColor: "var(--app-border)",
                  boxShadow: "var(--app-shadow)",
                  backgroundColor:
                    "color-mix(in srgb, var(--app-card) 88%, white)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="absolute right-4 top-4 text-xl text-[var(--app-accent)] opacity-0 transition-all duration-300 group-hover:rotate-12 group-hover:animate-[doodle-float_3s_ease-in-out_infinite] group-hover:opacity-100">
                  ✦
                </div>

                <h2 className="pr-6 text-xl font-bold tracking-wide text-[var(--app-text)] md:text-2xl">
                  {route.name}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                      color: "var(--app-accent)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {route.durationHours ?? "-"} 小時
                  </span>

                  <span
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--app-accent-2) 15%, transparent)",
                      color: "var(--app-accent-2)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                    </svg>
                    {route.suitableSeasons || "四季皆宜"}
                  </span>

                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium text-[var(--app-text-muted)]"
                    style={{ borderColor: "var(--app-border)" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                    </svg>
                    {route.difficulty || "輕鬆"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[var(--app-text-muted)]">
                  <p>
                    <strong className="font-medium text-[var(--app-text)]">
                      團體建議：
                    </strong>
                    {route.groupSizeNote || "無"}
                  </p>
                  <p>
                    <strong className="font-medium text-[var(--app-text)]">
                      站點數：
                    </strong>
                    {route.stops?.length ?? 0} 站
                  </p>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
                  {route.description || "目前尚無路線詳細描述。"}
                </p>

                <div className="mt-auto pt-6 text-right">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--app-accent)] transition-colors duration-300 group-hover:text-[var(--app-text)]">
                    <span className="relative pb-1">
                      探索路線
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-[var(--app-accent)] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <span
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}