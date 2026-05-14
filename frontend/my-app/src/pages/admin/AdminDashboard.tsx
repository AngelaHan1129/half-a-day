export default function AdminDashboard() {
  const cards = [
    { label: "景點數", value: "12" },
    { label: "路線數", value: "8" },
    { label: "知識庫文件", value: "156" },
    { label: "聲音花紀錄", value: "42" },
  ];

  const rows = [
    ["Place", "小半天高架橋", "2026-04-29"],
    ["Route", "春季一日遊", "2026-04-28"],
    ["Knowledge", "德興瀑布說明", "2026-04-28"],
  ];

  return (
    <div
      className="space-y-6 transition-colors duration-300"
      style={{ color: "var(--app-text)" }}
    >
      <section>
        <h2 className="text-3xl font-black">Dashboard</h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--app-text-muted)" }}
        >
          快速查看平台資料狀況與近期活動。
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border p-5 transition-colors duration-300"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-card)",
              boxShadow: "var(--app-shadow)",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              {card.label}
            </p>
            <p
              className="mt-3 text-3xl font-black"
              style={{ color: "var(--app-accent)" }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section
        className="rounded-3xl border p-5 transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-card)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">最近更新</h3>
          <button
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: "var(--app-accent)" }}
          >
            查看全部
          </button>
        </div>

        <div
          className="overflow-hidden rounded-2xl border transition-colors duration-300"
          style={{ borderColor: "var(--app-border)" }}
        >
          <table className="min-w-full text-left text-sm">
            <thead
              style={{
                background:
                  "color-mix(in srgb, var(--app-card) 70%, var(--app-bg) 30%)",
                color: "var(--app-text-muted)",
              }}
            >
              <tr>
                <th className="px-4 py-3 font-medium">類型</th>
                <th className="px-4 py-3 font-medium">名稱</th>
                <th className="px-4 py-3 font-medium">時間</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row[1]}
                  className="transition-colors duration-200"
                  style={{
                    borderTop: "1px solid var(--app-border)",
                    background: "var(--app-card)",
                  }}
                >
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {row[0]}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--app-text)" }}>
                    {row[1]}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {row[2]}
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