import { useMemo, useState } from "react";

type PlaceType = "景點" | "自然" | "文化" | "餐飲" | "住宿";

type PlaceRow = {
  id: number;
  name: string;
  type: PlaceType;
  location: string;
  status: "published" | "draft";
  updatedAt: string;
};

function AdminPlaces() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<PlaceType | "全部">("全部");

  const data: PlaceRow[] = [
    {
      id: 1,
      name: "小半天高架橋",
      type: "景點",
      location: "南投縣鹿谷鄉",
      status: "published",
      updatedAt: "2026-04-29",
    },
    {
      id: 2,
      name: "石馬公園",
      type: "文化",
      location: "南投縣鹿谷鄉",
      status: "published",
      updatedAt: "2026-04-28",
    },
    {
      id: 3,
      name: "德興瀑布",
      type: "自然",
      location: "南投縣鹿谷鄉",
      status: "draft",
      updatedAt: "2026-04-27",
    },
  ];

  const typeOptions: Array<PlaceType | "全部"> = [
    "全部",
    "景點",
    "自然",
    "文化",
    "餐飲",
    "住宿",
  ];

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.name.includes(keyword) ||
        item.location.includes(keyword);

      const matchType = type === "全部" || item.type === type;

      return matchKeyword && matchType;
    });
  }, [data, keyword, type]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black">Places</h2>
          <p className="mt-2 text-sm text-white/60">
            管理景點資料、分類與上架狀態。
          </p>
        </div>

        <button className="rounded-2xl bg-lime-300 px-4 py-3 text-sm font-semibold text-slate-950">
          新增景點
        </button>
      </section>

      <section className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_220px_auto]">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜尋景點名稱或地區..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-white/35"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as PlaceType | "全部")}
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
        >
          {typeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setKeyword("");
            setType("全部");
          }}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80"
        >
          重置篩選
        </button>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
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
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-4 font-medium">{item.name}</td>
                  <td className="px-4 py-4 text-white/70">{item.type}</td>
                  <td className="px-4 py-4 text-white/70">{item.location}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-lime-300/15 text-lime-300"
                          : "bg-amber-300/15 text-amber-300"
                      }`}
                    >
                      {item.status === "published" ? "已發布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/60">{item.updatedAt}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/80">
                        編輯
                      </button>
                      <button className="rounded-xl border border-rose-400/20 px-3 py-2 text-xs text-rose-300">
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminPlaces;