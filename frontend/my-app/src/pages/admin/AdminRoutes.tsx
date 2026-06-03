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
      className="p-4 md:p-6 transition-colors duration-500"
      style={{ color: "var(--app-text)" }}
    >
      {/* 注入手帳風特殊幾何切角語彙與框線樣式 */}
      <style>{`
        .bamboo-leaf-btn {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-btn:not(:disabled):hover {
          border-radius: 4px 16px 4px 16px;
        }
        .hand-drawn-card-border {
          border-radius: 24px 22px 24px 22px/18px 24px 18px 24px;
        }
        .hand-drawn-item-border {
          border-radius: 20px 24px 18px 22px/22px 16px 24px 18px;
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* 頂部標題列 */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between border-b pb-4 border-[var(--app-border)] border-dashed">
          <div>
            <div className="inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest text-[var(--app-accent)] mb-2"
                 style={{ borderColor: "var(--app-border)", backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }}>
              ✦ Route Planning Center
            </div>
            <h1 className="text-3xl font-black tracking-wide">導覽路線管理</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
              設計半日遊、一日遊主題體驗路線，配置適合季節、步行時數與成團人數限制。
            </p>
          </div>
        </section>

        {/* 錯誤錯誤訊息提示面板 */}
        {error && (
          <div className="hand-drawn-item-border border-2 p-4 text-sm flex items-center gap-2 transition-all duration-300"
               style={{ borderColor: "color-mix(in srgb, #e11d48 30%, transparent)", backgroundColor: "color-mix(in srgb, #e11d48 6%, transparent)", color: "#e11d48" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* 路線表單編輯/新增區塊 */}
        <section
          className="hand-drawn-card-border border-2 p-5 md:p-6 transition-all duration-500 bg-[var(--app-card)] shadow-md"
          style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
        >
          <div className="flex items-center justify-between border-b border-dashed pb-3 border-[var(--app-border)] mb-4">
            <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--app-accent)]"></span>
              {editingId ? "編輯主題導覽路線" : "繪製新旅遊路線"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-300 border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_20%,transparent)] flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                取消編輯
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 路線名稱 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">路線名稱</label>
              <input
                type="text"
                placeholder="例：小半天長源圳竹林幽徑半日遊"
                value={form.name ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 預估時數 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">預估時數 (小時)</label>
              <input
                type="number"
                placeholder="例：3.5"
                value={form.durationHours ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, durationHours: Number(e.target.value) }))
                }
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 適合季節 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">適合季節</label>
              <input
                type="text"
                placeholder="例：春季, 秋季 (以逗號分隔)"
                value={form.suitableSeasons ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, suitableSeasons: e.target.value }))
                }
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 難度等級 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">難度評級</label>
              <input
                type="text"
                placeholder="例：EASY, MEDIUM, HARD"
                value={form.difficulty ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, difficulty: e.target.value }))
                }
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 團體建議 */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">成團建議與人數限制備註</label>
              <input
                type="text"
                placeholder="例：適合 2-6 人家庭慢活、需自備雙肩背包"
                value={form.groupSizeNote ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, groupSizeNote: e.target.value }))
                }
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 封面圖片網址 */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">封面圖片 Unsplash / 圖床網址</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.coverImage ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                className="w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] font-mono text-xs"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>

            {/* 路線描述 */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">路線詳細內容與人文故事描述</label>
              <textarea
                placeholder="寫下這條竹林采風、或茶園深度的在地導覽故事核心..."
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full min-h-[110px] rounded-[14px] border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] resize-y"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* 表單送出按鈕組 */}
          <div className="mt-5 flex items-center gap-3 border-t border-dashed pt-4 border-[var(--app-border)]">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bamboo-leaf-btn px-6 py-2.5 text-sm font-bold transition-all duration-300 text-[var(--app-bg)] bg-[var(--app-accent)] disabled:opacity-50 flex items-center gap-1.5"
              style={{ boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 30%, transparent)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              {saving ? "紀錄儲存中..." : editingId ? "確認更新路線 ✦" : "描繪新增路線 ✦"}
            </button>

            <button
              onClick={resetForm}
              className="rounded-[14px] px-5 py-2.5 text-sm font-bold transition-all duration-300 border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_20%,transparent)]"
            >
              清空重置表單
            </button>
          </div>
        </section>

        {/* 路線清單數據渲染展示區 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-wide">現存導覽路線回憶錄</h2>
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--app-border)] font-mono bg-[var(--app-surface)] text-[var(--app-text-muted)]">
              {routes.length} 條路線
            </span>
          </div>

          {loading ? (
            <div className="hand-drawn-card-border border-2 p-8 text-center text-sm bg-[var(--app-card)] border-[var(--app-border)] text-[var(--app-text-muted)] animate-pulse flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
              正翻閱地圖，載入現有導覽路線...
            </div>
          ) : routes.length === 0 ? (
            <div className="hand-drawn-card-border border-2 p-10 text-center text-sm bg-[var(--app-card)] border-[var(--app-border)] text-[var(--app-text-muted)] italic">
              目前回憶錄中尚未規劃任何主題旅遊路線。
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {routes.map((route) => (
                <article
                  key={route.id}
                  className="hand-drawn-item-border border-2 p-5 transition-all duration-500 bg-[var(--app-card)] shadow-sm hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
                  style={{ borderColor: "var(--app-border)" }}
                >
                  <div>
                    {/* 卡片標題與裝飾 */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-black tracking-wide text-[var(--app-text)] group-hover:text-[var(--app-accent)] transition-colors">
                        {route.name}
                      </h3>
                    </div>
                    
                    {/* 描述段落 */}
                    <p className="mt-2 text-sm text-[var(--app-text-muted)] line-clamp-3 leading-relaxed">
                      {route.description || <span className="italic opacity-50">暫無相關導覽故事人文描述。</span>}
                    </p>

                    {/* 和風標籤膠帶組 */}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-accent)] flex items-center gap-1">
                        ⏱ {route.durationHours ?? "-"} 小時
                      </span>
                      <span className="px-2.5 py-0.5 rounded border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
                        🍃 {route.suitableSeasons || "四季皆宜"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
                        📊 難度: {route.difficulty || "普羅大眾"}
                      </span>
                      {route.groupSizeNote && (
                        <span className="px-2.5 py-0.5 rounded border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] col-span-2">
                          👥 {route.groupSizeNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 底層控制按鈕組 */}
                  <div className="mt-5 pt-3 border-t border-dashed border-[var(--app-border)] flex items-center justify-end gap-2">
                    {/* 編輯按鈕 */}
                    <button
                      onClick={() => handleEdit(route)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)] flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      編輯
                    </button>
                    
                    {/* 刪除按鈕 */}
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 flex items-center gap-1"
                      style={{
                        borderColor: "color-mix(in srgb, #e11d48 30%, transparent)",
                        background: "color-mix(in srgb, #e11d48 8%, var(--app-surface))",
                        color: "#e11d48",
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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