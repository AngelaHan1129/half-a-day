import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../app/router/paths";
import { isAuthenticated } from "../../services/api/auth";
import { useTheme } from "../providers/ThemeContext";

type NavItem = {
  label: string;
  to: string;
  end?: boolean;
};

const navItems: NavItem[] = [
  { label: "首頁", to: PATHS.discover, end: true },
  { label: "關於小半天", to: PATHS.about },
  { label: "景點導覽", to: PATHS.spots },
  { label: "遊程路線", to: PATHS.routes },
  { label: "建立預約", to: PATHS.booking },
  { label: "智慧推薦", to: PATHS.recommend },
  { label: "互動地圖", to: PATHS.map },
  { label: "AI影像體驗", to: PATHS.ar },
  { label: "聲音之花", to: PATHS.soundFlower },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);
  const authed = isAuthenticated();
  const isDark = theme === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 md:px-6 md:pt-3">
      {/* 注入手繪塗鴉微動畫 */}
      <style>{`
        @keyframes header-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(8deg); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[28px] backdrop-blur-xl transition-colors duration-500 border border-[var(--app-border)] bg-[var(--app-surface)]"
          style={{ boxShadow: "var(--app-shadow)" }}
        >
          {/* 裝飾性柔和色塊 (取代原本寫死的 rgb) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background: "linear-gradient(180deg, color-mix(in srgb, white 20%, transparent) 0%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute -left-12 top-0 h-24 w-40 rounded-full blur-3xl"
            style={{ background: "color-mix(in srgb, var(--app-accent) 15%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-20 w-32 rounded-full blur-3xl"
            style={{ background: "color-mix(in srgb, var(--app-accent-2) 12%, transparent)" }}
          />

          <div className="relative mx-auto flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            
            {/* 桌面版導覽列 */}
            <nav className="hidden items-center gap-1 lg:gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative rounded-full px-3 lg:px-4 py-2 text-sm transition-colors duration-300 ${
                      isActive
                        ? "font-bold text-[var(--app-accent)]"
                        : "font-medium text-[var(--app-muted)] hover:text-[var(--app-text)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{item.label}</span>
                      
                      {/* Active 狀態：日系手繪螢光筆畫線 */}
                      {isActive && (
                        <span 
                          className="absolute bottom-1.5 left-1/2 h-[8px] w-4/5 -translate-x-1/2 -z-10 transition-all"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--app-accent) 20%, transparent)",
                            borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" // 手繪感圓角
                          }}
                        />
                      )}

                      {/* Hover 狀態：底部輕柔的線條展開 */}
                      {!isActive && (
                        <span 
                          className="absolute bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[var(--app-accent)] opacity-40 transition-all duration-300 group-hover:w-1/2"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* 桌面版右側按鈕區 */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                aria-pressed={isDark}
                title={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] shadow-sm backdrop-blur-md transition-all duration-300 hover:animate-[header-float_2s_ease-in-out_infinite]"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {isDark ? "☀️" : "🌙"}
                </span>
              </button>

              <NavLink
                to={authed ? PATHS.admin : PATHS.login}
                className="group relative overflow-hidden rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-2 text-sm font-bold text-[var(--app-text)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* 按鈕 Hover 時的背景刷色動畫 */}
                <span className="absolute inset-0 -translate-x-full bg-[var(--app-accent)] opacity-10 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
                <span className="relative z-10 flex items-center gap-1">
                  {authed ? "管理後台" : "登入"}
                </span>
              </NavLink>
            </div>

            {/* 手機版按鈕區 */}
            <div className="flex items-center gap-2 md:hidden ml-auto">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] shadow-sm backdrop-blur-md transition duration-200"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {isDark ? "☀️" : "🌙"}
                </span>
              </button>

              <button
                type="button"
                aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] shadow-sm backdrop-blur-md transition-colors"
              >
                {/* 漢堡選單轉變動畫 */}
                <div className="relative flex h-4 w-5 flex-col justify-between overflow-hidden">
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all duration-300 ${mobileOpen ? "translate-x-5 opacity-0" : ""}`} />
                  <span className={`h-[2px] w-full transform rounded-full bg-current transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 手機版下拉選單 (Mobile Menu) */}
        <div
          id="mobile-menu"
          className={`mt-2 overflow-hidden rounded-[24px] shadow-lg backdrop-blur-2xl transition-all duration-300 md:hidden border border-[var(--app-border)] bg-[var(--app-surface)] ${
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <nav className="mx-auto flex flex-col gap-2 px-4 py-5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `relative flex items-center justify-between rounded-[16px] px-5 py-3.5 text-sm transition-all duration-300 ${
                    isActive
                      ? "font-bold text-[var(--app-accent)] bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)]"
                      : "font-medium text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_50%,transparent)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* Active 時右側出現可愛的小星星 */}
                    {isActive && (
                      <span className="text-lg animate-pulse" aria-hidden="true">
                        ✦
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="my-2 h-[1px] w-full bg-[var(--app-border)] opacity-50" />

            <NavLink
              to={authed ? PATHS.admin : PATHS.login}
              onClick={closeMobileMenu}
              className="flex w-full items-center justify-center rounded-[16px] border border-[var(--app-accent)] bg-[var(--app-card)] px-4 py-3.5 text-sm font-bold text-[var(--app-accent)] transition-all active:scale-95"
            >
              {authed ? "管理後台" : "登入系統"}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;