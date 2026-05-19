import { useEffect, useState } from "react";
import { routeApi } from "../../services/api/routesApi";
import type { Route } from "../../types/route";

const emptyForm: Partial<Route> = {
  name: "",
  description: "",
  durationHours: 0,
  suitableSeasons: "",
  difficulty: "",
  groupSizeNote: "",
  coverImage: "",
};

const AdminRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Route>>(emptyForm);

  const token = localStorage.getItem("token") || "";

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await routeApi.getAll();
      setRoutes(data);
    } catch (err) {
      console.error(err);
      setError("載入路線資料失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      if (!token) {
        setError("找不到登入 token，請先以管理者登入");
        return;
      }

      if (!form.name || !form.name.trim()) {
        setError("請輸入路線名稱");
        return;
      }

      setSaving(true);
      setError("");

      const payload: Partial<Route> = {
        ...form,
        durationHours: Number(form.durationHours || 0),
      };

      if (editingId) {
        await routeApi.update(editingId, payload, token);
      } else {
        await routeApi.create(payload, token);
      }

      resetForm();
      await loadRoutes();
    } catch (err) {
      console.error(err);
      setError("儲存路線失敗");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (route: Route) => {
    setEditingId(route.id);
    setForm({
      name: route.name,
      description: route.description,
      durationHours: route.durationHours,
      suitableSeasons: route.suitableSeasons,
      difficulty: route.difficulty,
      groupSizeNote: route.groupSizeNote,
      coverImage: route.coverImage,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    try {
      if (!token) {
        setError("找不到登入 token，請先以管理者登入");
        return;
      }

      const confirmed = window.confirm("確定要刪除這筆路線嗎？");
      if (!confirmed) return;

      setError("");
      await routeApi.remove(id, token);
      await loadRoutes();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("刪除路線失敗");
    }
  };

  return (
    <main
      className="p-6 transition-colors duration-300"
      style={{ color: "var(--app-text)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold">路線管理</h1>
        <p className="mt-2" style={{ color: "var(--app-text-muted)" }}>
          可新增、修改與刪除旅遊路線資料。
        </p>

        {error && (
          <p className="mt-4 text-sm" style={{ color: "#e11d48" }}>
            {error}
          </p>
        )}

        <section
          className="mt-6 rounded-3xl border p-5"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId ? "編輯路線" : "新增路線"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-xl px-3 py-2 text-sm font-medium"
                style={{
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)",
                }}
              >
                取消編輯
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="路線名稱"
              value={form.name ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="rounded-2xl border px-4 py-3"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <input
              type="number"
              placeholder="時數"
              value={form.durationHours ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, durationHours: Number(e.target.value) }))
              }
              className="rounded-2xl border px-4 py-3"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <input
              type="text"
              placeholder="適合季節，例如 spring,summer"
              value={form.suitableSeasons ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, suitableSeasons: e.target.value }))
              }
              className="rounded-2xl border px-4 py-3"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <input
              type="text"
              placeholder="難度，例如 EASY"
              value={form.difficulty ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="rounded-2xl border px-4 py-3"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <input
              type="text"
              placeholder="團體建議，例如 2-6人"
              value={form.groupSizeNote ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, groupSizeNote: e.target.value }))
              }
              className="rounded-2xl border px-4 py-3 md:col-span-2"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <input
              type="text"
              placeholder="封面圖片網址"
              value={form.coverImage ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, coverImage: e.target.value }))
              }
              className="rounded-2xl border px-4 py-3 md:col-span-2"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />

            <textarea
              placeholder="路線描述"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-[120px] rounded-2xl border px-4 py-3 md:col-span-2"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
              }}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-2xl px-4 py-3 font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--app-accent)" }}
            >
              {saving ? "儲存中..." : editingId ? "更新路線" : "新增路線"}
            </button>

            <button
              onClick={resetForm}
              className="rounded-2xl px-4 py-3 font-semibold"
              style={{
                background: "var(--app-surface)",
                border: "1px solid var(--app-border)",
              }}
            >
              清空表單
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">目前路線</h2>

          {loading ? (
            <p className="mt-4">載入中...</p>
          ) : routes.length === 0 ? (
            <p className="mt-4">目前沒有路線資料</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {routes.map((route) => (
                <article
                  key={route.id}
                  className="rounded-3xl border p-5"
                  style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-card)",
                    boxShadow: "var(--app-shadow)",
                  }}
                >
                  <h3 className="text-lg font-bold">{route.name}</h3>
                  <p className="mt-2 text-sm">{route.description || "無描述"}</p>
                  <div
                    className="mt-3 space-y-1 text-sm"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    <p>時數：{route.durationHours ?? "未提供"} 小時</p>
                    <p>季節：{route.suitableSeasons || "未提供"}</p>
                    <p>難度：{route.difficulty || "未提供"}</p>
                    <p>團體建議：{route.groupSizeNote || "未提供"}</p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(route)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-white"
                      style={{ background: "#2563eb" }}
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-white"
                      style={{ background: "#dc2626" }}
                    >
                      刪除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminRoutes;