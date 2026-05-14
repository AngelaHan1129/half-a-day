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
  { label: "AR 體驗", to: PATHS.ar },
  { label: "聲音之花", to: PATHS.soundFlower },
];

const desktopLinkBase =
  "rounded-full px-4 py-2 text-sm font-medium transition duration-200";

const mobileLinkBase =
  "rounded-2xl px-4 py-3 text-sm font-medium transition";

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

  const renderDesktopNavClass = (isActive: boolean) =>
    [
      desktopLinkBase,
      isActive
        ? "font-semibold shadow-[0_8px_24px_rgba(47,158,68,0.28)]"
        : "hover:bg-white/10",
    ].join(" ");

  const renderMobileNavClass = (isActive: boolean) =>
    [
      mobileLinkBase,
      isActive
        ? "font-semibold shadow-[0_8px_20px_rgba(47,158,68,0.24)]"
        : "hover:bg-white/10",
    ].join(" ");

  const closeMobileMenu = () => setMobileOpen(false);
  const authed = isAuthenticated();
  const isDark = theme === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 md:px-6 md:pt-3">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[28px] backdrop-blur-md"
          style={{
            border: "1px solid var(--app-border)",
            background: "var(--app-surface)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.02) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute -left-12 top-0 h-24 w-40 rounded-full blur-3xl"
            style={{ background: "rgba(47, 158, 68, 0.12)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-20 w-32 rounded-full blur-3xl"
            style={{ background: "rgba(111, 207, 124, 0.10)" }}
          />

          <div className="relative mx-auto flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => renderDesktopNavClass(isActive)}
                  style={({ isActive }) => ({
                    background: isActive ? "#2f9e44" : "transparent",
                    color: isActive ? "#ffffff" : "var(--app-text)",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                aria-pressed={isDark}
                title={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition duration-200 hover:scale-105"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-card)",
                  color: "var(--app-text)",
                }}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {isDark ? "☀️" : "🌙"}
                </span>
              </button>

              <NavLink
                to={authed ? PATHS.admin : PATHS.login}
                className="rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition"
                style={{
                  border: "1px solid var(--app-border)",
                  background: "var(--app-card)",
                  color: "var(--app-text)",
                }}
              >
                {authed ? "管理後台" : "登入"}
              </NavLink>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                aria-pressed={isDark}
                title={isDark ? "切換為亮色模式" : "切換為暗色模式"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition duration-200"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-card)",
                  color: "var(--app-text)",
                }}
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-card)",
                  color: "var(--app-text)",
                }}
              >
                <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={[
            "mt-2 overflow-hidden rounded-[24px] shadow-[0_18px_40px_rgba(0,0,0,0.16)] backdrop-blur-2xl transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
          style={{
            border: mobileOpen
              ? "1px solid var(--app-border)"
              : "1px solid transparent",
            background: "var(--app-surface)",
          }}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) => renderMobileNavClass(isActive)}
                style={({ isActive }) => ({
                  background: isActive ? "#2f9e44" : "var(--app-card)",
                  color: isActive ? "#ffffff" : "var(--app-text)",
                  border: `1px solid ${
                    isActive ? "transparent" : "var(--app-border)"
                  }`,
                })}
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to={authed ? PATHS.admin : PATHS.login}
              onClick={closeMobileMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium transition"
              style={{
                background: "var(--app-card)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
              }}
            >
              {authed ? "管理後台" : "登入"}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;