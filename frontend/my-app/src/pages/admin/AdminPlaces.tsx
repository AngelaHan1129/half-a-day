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
      className="space-y-6 transition-colors duration-300"
      style={{ color: "var(--app-text)" }}
    >
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black">Places</h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--app-text-muted)" }}
          >
            管理景點資料、分類與上架狀態。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadPlaces}
            className="rounded-2xl border px-4 py-3 text-sm transition-colors duration-200"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-card)",
              color: "var(--app-text)",
            }}
          >
            重新整理
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-200"
            style={{
              background: "var(--app-accent)",
              color: "#ffffff",
              boxShadow: "var(--app-shadow)",
            }}
          >
            新增景點
          </button>
        </div>
      </section>

      <section
        className="grid gap-3 rounded-3xl border p-4 transition-colors duration-300 lg:grid-cols-[1fr_220px_auto]"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-card)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜尋景點名稱或地區..."
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-surface)",
            color: "var(--app-text)",
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as PlaceUiType | "全部")}
          className="rounded-2xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-surface)",
            color: "var(--app-text)",
          }}
        >
          {PLACE_UI_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="rounded-2xl border px-4 py-3 text-sm transition-colors duration-200"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            color: "var(--app-text)",
          }}
        >
          重置篩選
        </button>
      </section>

      {loading && (
        <section
          className="rounded-3xl border p-6 text-sm transition-colors duration-300"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            color: "var(--app-text-muted)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          載入景點資料中...
        </section>
      )}

      {error && (
        <section
          className="rounded-3xl border p-6 text-sm transition-colors duration-300"
          style={{
            borderColor: "rgba(244, 63, 94, 0.24)",
            background: "rgba(244, 63, 94, 0.08)",
            color: "var(--app-text)",
          }}
        >
          {error}
        </section>
      )}

      {!loading && !error && (
        <section
          className="overflow-hidden rounded-3xl border transition-colors duration-300"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead
                style={{
                  background:
                    "color-mix(in srgb, var(--app-card) 68%, var(--app-bg) 32%)",
                  color: "var(--app-text-muted)",
                }}
              >
                <tr>
                  <th className="px-4 py-3 font-medium">名稱</th>
                  <th className="px-4 py-3 font-medium">類型</th>
                  <th className="px-4 py-3 font-medium">地區</th>
                  <th className="px-4 py-3 font-medium">狀態</th>
                  <th className="px-4 py-3 font-medium">更新時間</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors duration-200"
                    style={{
                      borderTop: "1px solid var(--app-border)",
                      background: "var(--app-card)",
                    }}
                  >
                    <td
                      className="px-4 py-4 font-medium"
                      style={{ color: "var(--app-text)" }}
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      {item.type}
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      {item.location}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background:
                            "color-mix(in srgb, var(--app-accent) 12%, var(--app-card))",
                          color: "var(--app-accent)",
                        }}
                      >
                        {item.status === "published" ? "已發布" : "草稿"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      {item.updatedAt}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPlace(getPlaceById(item.id))}
                          className="rounded-xl border px-3 py-2 text-xs transition-colors duration-200"
                          style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-surface)",
                            color: "var(--app-text)",
                          }}
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="rounded-xl border px-3 py-2 text-xs transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                          style={{
                            borderColor: "rgba(244, 63, 94, 0.24)",
                            background: "rgba(244, 63, 94, 0.08)",
                            color: "#e11d48",
                          }}
                        >
                          {deletingId === item.id ? "刪除中..." : "刪除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      查無符合條件的景點資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

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