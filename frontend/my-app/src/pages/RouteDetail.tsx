import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routeApi } from "../services/api/routesApi";
import type { Route } from "../types/route";

export default function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoute = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("缺少路線 ID");
        }

        const data = await routeApi.getById(Number(id));
        setRoute(data);
      } catch (err) {
        console.error(err);
        setError("載入路線詳細資料失敗");
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [id]);

  if (loading) {
    return <main className="p-8">載入中...</main>;
  }

  if (error) {
    return <main className="p-8 text-red-500">{error}</main>;
  }

  if (!route) {
    return <main className="p-8">找不到路線</main>;
  }

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-8"
      style={{ background: "var(--app-bg)", color: "var(--app-text)" }}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          to="/routes"
          className="text-sm"
          style={{ color: "var(--app-text-muted)" }}
        >
          ← 返回路線列表
        </Link>

        <div
          className="mt-4 rounded-3xl border p-6"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <h1 className="text-3xl font-black">{route.name}</h1>
          <p className="mt-4">{route.description || "無描述"}</p>

          <div className="mt-6 grid gap-2 text-sm md:grid-cols-2">
            <p>
              <strong>時數：</strong>
              {route.durationHours ?? "未提供"} 小時
            </p>
            <p>
              <strong>適合季節：</strong>
              {route.suitableSeasons || "未提供"}
            </p>
            <p>
              <strong>難度：</strong>
              {route.difficulty || "未提供"}
            </p>
            <p>
              <strong>團體建議：</strong>
              {route.groupSizeNote || "未提供"}
            </p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold">路線站點</h2>

          {!route.stops || route.stops.length === 0 ? (
            <p className="mt-4 text-sm" style={{ color: "var(--app-text-muted)" }}>
              目前沒有站點資料
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {route.stops.map((stop, index) => (
                <div
                  key={stop.id ?? index}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-surface)",
                  }}
                >
                  <p>
                    <strong>順序：</strong>
                    {stop.stopOrder ?? index + 1}
                  </p>
                  <p>
                    <strong>景點：</strong>
                    {stop.place?.name || "未提供"}
                  </p>
                  <p>
                    <strong>停留時間：</strong>
                    {stop.stayMinutes ?? "未提供"} 分鐘
                  </p>
                  <p>
                    <strong>備註：</strong>
                    {stop.note || "無"}
                  </p>
                  <p>
                    <strong>前往下一站：</strong>
                    {stop.transportToNext || "未提供"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}