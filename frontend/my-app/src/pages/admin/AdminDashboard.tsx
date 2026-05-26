export default function AdminDashboard() {
  const cards = [
    { 
      label: "景點數", 
      value: "12",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      )
    },
    { 
      label: "遊程路線數", 
      value: "8",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      )
    },
    { 
      label: "知識庫文件", 
      value: "156",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    { 
      label: "聲音花紀錄", 
      value: "42",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      )
    },
  ];

  const rows = [
    { type: "Place", typeLabel: "地方景點", name: "小半天高架橋", date: "2026-04-29", color: "var(--app-accent)" },
    { type: "Route", typeLabel: "導覽路線", name: "春季一日遊", date: "2026-04-28", color: "var(--app-accent-2)" },
    { type: "Knowledge", typeLabel: "地方知識", name: "德興瀑布說明", date: "2026-04-28", color: "var(--app-text-muted)" },
  ];

  return (
    <div
      className="space-y-8 p-1 transition-colors duration-500"
      style={{ color: "var(--app-text)" }}
    >
      {/* 注入手動不規則圓角與微浮動動畫 */}
      <style>{`
        @keyframes doodle-float {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-4px) rotate(1.5deg); }
        }
        .hand-drawn-border {
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .hand-drawn-border:hover {
          border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
        }
        .hand-drawn-table-border {
          border-radius: 20px 20px 225px 255px/20px 20px 15px 15px;
        }
      `}</style>

      {/* 頂部標題區 */}
      <section className="relative md:flex md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest text-[var(--app-accent)] mb-3"
               style={{ borderColor: "var(--app-border)", backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }}>
            ✦ USR 後台管理中心
          </div>
          <h2 className="text-3xl font-black tracking-wide md:text-4xl">小半天管理總覽</h2>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            快速查看平台生態資料建置狀況、聲音採集記錄與近期學術、地方活動。
          </p>
        </div>
      </section>

      {/* 數據卡片區：手動塗鴉微動態 */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group hand-drawn-border relative border-2 p-6 transition-all duration-500 ease-out bg-[var(--app-card)] hover:-translate-y-1.5 hover:shadow-xl"
            style={{
              borderColor: "var(--app-border)",
              boxShadow: "var(--app-shadow)",
            }}
          >
            {/* Hover 時右上方浮現的手寫感四角星 */}
            <div className="absolute right-4 top-4 text-xs opacity-0 transition-all duration-300 group-hover:opacity-60 group-hover:animate-[doodle-float_2.5s_ease-in-out_infinite] text-[var(--app-accent)]" aria-hidden="true">
              ✦
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold tracking-wide text-[var(--app-text-muted)]">
                {card.label}
              </p>
              <div className="text-[var(--app-muted)] transition-colors group-hover:text-[var(--app-accent)]">
                {card.icon}
              </div>
            </div>

            <p className="mt-4 text-4xl font-serif font-bold tracking-tight text-[var(--app-accent)]">
              {card.value}
              <span className="text-xs font-normal text-[var(--app-muted)] ml-1">個記錄</span>
            </p>
          </div>
        ))}
      </section>

      {/* 最近更新區表格：手帳紙膠帶風 */}
      <section
        className="hand-drawn-table-border overflow-hidden border-2 p-5 transition-all duration-500 bg-[var(--app-card)] shadow-md"
        style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
      >
        <div className="mb-5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--app-accent-2)] animate-pulse" />
            <h3 className="text-lg font-bold tracking-wide">最近更新動態</h3>
          </div>
          
          <button
            className="group/btn text-sm font-bold transition-colors duration-200 text-[var(--app-accent)] hover:text-[var(--app-text)] flex items-center gap-1"
          >
            <span>查看全部</span>
            <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">→</span>
          </button>
        </div>

        {/* 表格容器 */}
        <div
          className="overflow-hidden rounded-[16px] border transition-colors duration-300"
          style={{ borderColor: "var(--app-border)" }}
        >
          <table className="min-w-full text-left text-sm border-collapse">
            <thead
              style={{
                background: "color-mix(in srgb, var(--app-card) 60%, var(--app-bg) 40%)",
                color: "var(--app-text-muted)",
              }}
            >
              <tr>
                <th className="px-5 py-3.5 font-bold tracking-wider w-[160px]">資料類型</th>
                <th className="px-5 py-3.5 font-bold tracking-wider">實體名稱</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-right w-[140px]">更新日期</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className="transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--app-border)_25%,transparent)]"
                  style={{
                    borderTop: "1px dashed var(--app-border)", // 改為手帳撕線虛線
                    background: "var(--app-card)",
                  }}
                >
                  <td className="px-5 py-3.5">
                    {/* 紙膠帶/和風印章風格的小 Badge */}
                    <span 
                      className="inline-block px-3 py-1 text-xs font-bold rounded-md"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${row.color} 12%, transparent)`,
                        color: row.color,
                        border: `1px dashed color-mix(in srgb, ${row.color} 40%, transparent)`
                      }}
                    >
                      {row.typeLabel}
                    </span>
                  </td>
                  
                  <td className="px-5 py-3.5 font-medium text-[var(--app-text)]">
                    {row.name}
                  </td>
                  
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-[var(--app-text-muted)]">
                    {row.date}
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