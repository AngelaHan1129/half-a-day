import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { routeApi } from "../services/api/routesApi";
import type { Route } from "../types/route";

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
      className="min-h-screen px-4 py-8 md:px-8"
      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black">遊程路線</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--app-text-muted)" }}>
          瀏覽小半天旅遊路線，依關鍵字、時數與季節快速篩選。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="輸入關鍵字搜尋路線"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value) {
                setMaxHours("");
                setSeason("");
              }
            }}
            className="min-w-[240px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-surface)",
              color: "var(--app-text)",
            }}
          />

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
            className="w-[140px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-surface)",
              color: "var(--app-text)",
            }}
          />

          <input
            type="text"
            placeholder="季節，例如 spring"
            value={season}
            onChange={(e) => {
              setSeason(e.target.value);
              if (e.target.value) {
                setKeyword("");
                setMaxHours("");
              }
            }}
            className="w-[180px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-surface)",
              color: "var(--app-text)",
            }}
          />

          <button
            onClick={() => {
              setKeyword("");
              setMaxHours("");
              setSeason("");
            }}
            className="rounded-2xl px-4 py-3 font-semibold"
            style={{
              background: "var(--app-accent)",
              color: "#fff",
            }}
          >
            清除篩選
          </button>
        </div>

        <div className="mt-4 text-sm" style={{ color: "var(--app-text-muted)" }}>
          目前條件：{activeFilter}
        </div>

        {loading && <p className="mt-8">載入中...</p>}
        {error && (
          <p className="mt-8 text-sm" style={{ color: "#e11d48" }}>
            {error}
          </p>
        )}
        {!loading && !error && routes.length === 0 && (
          <p className="mt-8">查無路線資料</p>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => (
            <Link key={route.id} to={`/routes/${route.id}`} className="block">
              <article
                className="rounded-3xl border p-5 transition hover:-translate-y-1"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-card)",
                  boxShadow: "var(--app-shadow)",
                }}
              >
                <h2 className="text-xl font-bold">{route.name}</h2>
                <p className="mt-3 text-sm">
                  <strong>時數：</strong>
                  {route.durationHours ?? "未提供"} 小時
                </p>
                <p className="mt-1 text-sm">
                  <strong>適合季節：</strong>
                  {route.suitableSeasons || "未提供"}
                </p>
                <p className="mt-1 text-sm">
                  <strong>難度：</strong>
                  {route.difficulty || "未提供"}
                </p>
                <p className="mt-1 text-sm">
                  <strong>團體建議：</strong>
                  {route.groupSizeNote || "未提供"}
                </p>
                <p className="mt-1 text-sm">
                  <strong>站點數：</strong>
                  {route.stops?.length ?? 0}
                </p>
                <p className="mt-3 text-sm" style={{ color: "var(--app-text-muted)" }}>
                  {route.description || "無描述"}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}