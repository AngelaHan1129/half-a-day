import { useEffect, useMemo, useState } from "react";
import PlaceFormModal from "../../components/admin/PlaceFormModal";
import { placeApi } from "../../services/api/placeApi";
import {
  PLACE_TYPE_LABEL,
  PLACE_UI_TYPE_OPTIONS,
  type Place,
  type PlaceUiType,
} from "../../types/place";

type PlaceRow = {
  id: number;
  name: string;
  type: PlaceUiType;
  location: string;
  status: "published" | "draft";
  updatedAt: string;
};

function toPlaceRow(place: Place): PlaceRow {
  return {
    id: place.id,
    name: place.name,
    type: PLACE_TYPE_LABEL[place.type],
    location: place.address ?? "",
    status: "published",
    updatedAt: place.updatedAt ? place.updatedAt.slice(0, 10) : "-",
  };
}

function AdminPlaces() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<PlaceUiType | "全部">("全部");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await placeApi.getAll();
      setPlaces(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入景點失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const rows = useMemo(() => places.map(toPlaceRow), [places]);

  const filtered = useMemo(() => {
    return rows.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.name.includes(keyword) ||
        item.location.includes(keyword);

      const matchType = type === "全部" || item.type === type;

      return matchKeyword && matchType;
    });
  }, [rows, keyword, type]);

  const handleReset = () => {
    setKeyword("");
    setType("全部");
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("確定要刪除這筆景點資料嗎？");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await placeApi.delete(id);
      setPlaces((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "刪除失敗");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateSuccess = (created: Place) => {
    setPlaces((prev) => [created, ...prev]);
  };

  const handleEditSuccess = (updated: Place) => {
    setPlaces((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const getPlaceById = (id: number) => {
    return places.find((item) => item.id === id) ?? null;
  };

  return (
    <div
      className="space-y-6 p-1 transition-colors duration-500"
      style={{ color: "var(--app-text)" }}
    >
      {/* 注入手帳風剪裁與微小動態語彙 */}
      <style>{`
        .bamboo-leaf-shape {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-shape:not(:disabled):hover {
          border-radius: 4px 16px 4px 16px;
        }
        .hand-drawn-filter-border {
          border-radius: 20px 20px 18px 22px/15px 25px 18px 22px;
        }
        .hand-drawn-table-box {
          border-radius: 22px 22px 255px 255px/22px 22px 15px 15px;
        }
      `}</style>

      {/* 頂部控制標題列 */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest text-[var(--app-accent)] mb-3"
               style={{ borderColor: "var(--app-border)", backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }}>
            ✦ Field Research Notes
          </div>
          <h2 className="text-3xl font-black tracking-wide">景點資料管理</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            維護小半天休閒農業區核心景點資料、地理分類標籤與導覽上架狀態。
          </p>
        </div>

        {/* 頂部按鈕列 */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={loadPlaces}
            className="rounded-full border px-5 py-3 text-sm font-bold transition-all duration-300 border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-card)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)] flex items-center gap-1.5 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            重新整理
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="bamboo-leaf-shape px-6 py-3 text-sm font-bold transition-all duration-300 text-[var(--app-bg)] bg-[var(--app-accent)] shadow-md flex items-center gap-1.5"
            style={{ boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 35%, transparent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            新增景點 ✦
          </button>
        </div>
      </section>

      {/* 搜尋過濾工具列（手帳框） */}
      <section
        className="hand-drawn-filter-border grid gap-4 border-2 p-4 transition-all duration-500 bg-[var(--app-card)] lg:grid-cols-[1fr_240px_auto]"
        style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
      >
        {/* 關鍵字輸入 */}
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="輸入景點名稱、古道或特定地區關鍵字..."
            className="w-full rounded-[14px] border pl-11 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-muted)]"
            style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
          />
        </div>

        {/* 下拉篩選 */}
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PlaceUiType | "全部")}
            className="w-full rounded-[14px] border pl-11 pr-10 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] cursor-pointer appearance-none"
            style={{ '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)' } as React.CSSProperties}
          >
            {PLACE_UI_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "全部" ? "所有類型分類" : opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        {/* 重置按鈕 */}
        <button
          onClick={handleReset}
          className="rounded-[14px] border px-5 py-2.5 text-sm font-semibold transition-all duration-300 border-[var(--app-border)] text-[var(--app-text-muted)] bg-[var(--app-card)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text)]"
        >
          清除重置
        </button>
      </section>

      {/* 異常與載入面板提示 */}
      {loading && (
        <section className="hand-drawn-filter-border border-2 p-6 text-sm bg-[var(--app-card)] border-[var(--app-border)] text-[var(--app-text-muted)] animate-pulse flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
          正翻閱回憶錄，載入景點資料庫中...
        </section>
      )}

      {error && (
        <section className="hand-drawn-filter-border border-2 p-6 text-sm flex items-center gap-2"
                 style={{ borderColor: "color-mix(in srgb, #e11d48 30%, transparent)", backgroundColor: "color-mix(in srgb, #e11d48 8%, transparent)", color: "#e11d48" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </section>
      )}

      {/* 主數據表格清單面板 */}
      {!loading && !error && (
        <section
          className="hand-drawn-table-box overflow-hidden border-2 transition-all duration-500 bg-[var(--app-card)] shadow-lg"
          style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead
                style={{
                  background: "color-mix(in srgb, var(--app-card) 60%, var(--app-bg) 40%)",
                  color: "var(--app-text-muted)",
                }}
              >
                <tr>
                  <th className="px-5 py-4 font-bold tracking-wider">景點名稱</th>
                  <th className="px-5 py-4 font-bold tracking-wider w-[120px]">類型</th>
                  <th className="px-5 py-4 font-bold tracking-wider">地理位置 / 描述</th>
                  <th className="px-5 py-4 font-bold tracking-wider w-[120px]">發布狀態</th>
                  <th className="px-5 py-4 font-bold tracking-wider text-center w-[160px]">操作</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--app-border)_20%,transparent)]"
                    style={{
                      borderTop: "1px dashed var(--app-border)", // 手帳撕線設計
                      background: "var(--app-card)",
                    }}
                  >
                    <td className="px-5 py-4 font-bold text-[var(--app-text)]">
                      {item.name}
                    </td>
                    
                    <td className="px-5 py-4">
                      {/* 紙膠帶分類章 */}
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
                        {item.type}
                      </span>
                    </td>
                    
                    <td className="px-5 py-4 text-[var(--app-text-muted)] max-w-xs truncate">
                      {item.location || <span className="italic opacity-50">未提供位置資料</span>}
                    </td>
                    
                    <td className="px-5 py-4">
                      {/* 狀態膠帶章 */}
                      <span
                        className="inline-block px-3 py-0.5 text-xs font-bold rounded-md border"
                        style={{
                          background: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                          borderColor: "color-mix(in srgb, var(--app-accent) 30%, transparent)",
                          color: "var(--app-accent)",
                        }}
                      >
                        {item.status === "published" ? "已發布" : "草稿"}
                      </span>
                    </td>
                    
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 編輯 */}
                        <button
                          onClick={() => setEditingPlace(getPlaceById(item.id))}
                          className="rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)] flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          編輯
                        </button>
                        
                        {/* 刪除 */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-1"
                          style={{
                            borderColor: "color-mix(in srgb, #e11d48 30%, transparent)",
                            background: "color-mix(in srgb, #e11d48 8%, var(--app-surface))",
                            color: "#e11d48",
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          {deletingId === item.id ? "處理中" : "刪除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm font-medium italic text-[var(--app-text-muted)] bg-[var(--app-card)]"
                    >
                      筆記本中查無符合條件的景點紀錄。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 彈出彈窗元件 */}
      <PlaceFormModal
        open={createOpen}
        mode="create"
        initialData={null}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <PlaceFormModal
        open={!!editingPlace}
        mode="edit"
        initialData={editingPlace}
        onClose={() => setEditingPlace(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

export default AdminPlaces;