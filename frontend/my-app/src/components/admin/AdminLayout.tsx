import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../app/router/paths";

type Props = {
  children: ReactNode;
};

// 封裝 Iconify 風格的純 SVG 線條圖標
const navItems = [
  { 
    to: "/admin", 
    label: "所有資訊",
    end: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1"></rect>
        <rect x="14" y="3" width="7" height="5" rx="1"></rect>
        <rect x="14" y="12" width="7" height="9" rx="1"></rect>
        <rect x="3" y="16" width="7" height="5" rx="1"></rect>
      </svg>
    )
  },
  { 
    to: "/admin/places", 
    label: "景點管理",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    )
  },
  { 
    to: "/admin/routes", 
    label: "遊程路線",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    )
  },
  { 
    to: "/admin/knowledge", 
    label: "地方知識學",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    )
  },
];

export default function AdminLayout({ children }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    navigate(PATHS.login);
  };

  const handleCloseSidebar = () => {
    setOpen(false);
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      {/* 注入日系書籤與微動態 CSS */}
      <style>{`
        @keyframes item-float {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .admin-nav-item {
          position: relative;
          display: flex;
          items-center: center;
          gap: 0.75rem;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        .admin-nav-item:hover:not(.active) {
          background: color-mix(in srgb, var(--app-border) 40%, transparent);
          color: var(--app-text);
          padding-left: 1.15rem;
        }
        .admin-sidebar-box {
          border-radius: 0 28px 28px 0;
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* 行動裝置遮罩層 */}
        {open && (
          <button
            type="button"
            aria-label="關閉側邊選單"
            onClick={handleCloseSidebar}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden outline-none"
          />
        )}

        {/* 側邊導覽選單（Aside） */}
        <aside
          className={`admin-sidebar-box fixed inset-y-0 left-0 z-40 w-72 border-r p-6 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
          }`}
          style={{
            borderColor: "var(--app-border)",
            background: "color-mix(in srgb, var(--app-card) 94%, transparent)",
            color: "var(--app-text)",
          }}
        >
          {/* 選單頂部 LOGO 區 */}
          <div className="mb-8 flex items-start justify-between gap-4 border-b border-dashed pb-5 border-[var(--app-border)]">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: "var(--app-accent)" }}
              >
                Half a Day ✦ USR
              </p>
              <h1 className="mt-1.5 text-2xl font-black tracking-wide">控制台後台</h1>
              <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-muted)]">
                南投鹿谷小半天地方生境、智慧觀光導覽數據維護系統。
              </p>
            </div>

            {/* 手機版關閉按鈕 */}
            <button
              type="button"
              onClick={handleCloseSidebar}
              className="rounded-full border p-2 text-xs font-bold transition-all lg:hidden border-[var(--app-border)] bg-[var(--app-surface)] hover:text-[var(--app-accent)]"
            >
              ✕
            </button>
          </div>

          {/* 導覽連結列（手帳書籤設計） */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  `admin-nav-item group ${isActive ? "active font-bold" : "font-medium"}`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "color-mix(in srgb, var(--app-accent) 14%, transparent)" : "transparent",
                  color: isActive ? "var(--app-accent)" : "var(--app-text-muted)",
                  borderLeft: isActive ? "4px solid var(--app-accent)" : "4px solid transparent",
                  paddingLeft: isActive ? "0.9rem" : "1rem",
                })}
              >
                {({ isActive }) => (
                  <>
                    <span className={`transition-colors duration-300 ${isActive ? "text-[var(--app-accent)]" : "text-[var(--app-muted)] group-hover:text-[var(--app-text)]"}`}>
                      {item.icon}
                    </span>
                    <span className="relative">
                      {item.label}
                      {isActive && (
                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--app-accent-2)]" aria-hidden="true">✦</span>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* 右側主要內容容器（Main Content） */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 頂部不固定功能橫條 */}
          <header
            className="sticky top-0 z-20 border-b backdrop-blur-md transition-colors duration-500"
            style={{
              borderColor: "var(--app-border)",
              background: "color-mix(in srgb, var(--app-bg) 85%, transparent)",
            }}
          >
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              {/* 行動裝置漢堡選單觸發鈕 */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all lg:hidden border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-card)] shadow-sm"
              >
                <div className="relative flex h-3.5 w-4 flex-col justify-between overflow-hidden">
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all ${open ? "translate-y-[6px] rotate-45" : ""}`} />
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all ${open ? "translate-x-4 opacity-0" : ""}`} />
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
                </div>
              </button>

              {/* 右側頂端控制按鈕群 */}
              <div className="ml-auto flex items-center gap-3">
                <Link
                  to={PATHS.discover}
                  className="rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_30%,transparent)] flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  返回前台首頁
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300"
                  style={{
                    borderColor: "color-mix(in srgb, #e11d48 30%, transparent)",
                    color: "#e11d48",
                    backgroundColor: "transparent",
                  }}
                >
                  登出系統
                </button>

                <div
                  className="hidden rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide md:block"
                  style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-card)",
                    color: "var(--app-text-muted)",
                  }}
                >
                  Admin Console
                </div>

                {/* 代表管理權限的雙色和風味裝飾球 */}
                <div
                  className="h-8 w-8 rounded-full border border-white/20 shadow-sm animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                  }}
                />
              </div>
            </div>
          </header>

          {/* 子路由元件注入點 */}
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}