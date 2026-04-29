import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../app/router/paths";
import { isAuthenticated } from "../../services/api/auth";
type NavItem = {
  label: string;
  to: string;
  end?: boolean;
};

const navItems: NavItem[] = [
  { label: "首頁", to: PATHS.home, end: true },
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
        ? "bg-lime-300 text-slate-950 shadow-[0_8px_24px_rgba(190,242,100,0.28)]"
        : "text-white/92 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const renderMobileNavClass = (isActive: boolean) =>
    [
      mobileLinkBase,
      isActive
        ? "bg-lime-300 text-slate-950 shadow-[0_8px_20px_rgba(190,242,100,0.22)]"
        : "bg-white/6 text-white/90 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const closeMobileMenu = () => setMobileOpen(false);
  const authed = isAuthenticated();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 md:px-6 md:pt-3">
      <div className="mx-auto max-w-7xl">
        <div
          className="
    relative overflow-hidden rounded-[28px]
    border border-white/14
    bg-white/[0.015]
    shadow-[0_2px_12px_rgba(0,0,0,0.04)]
    backdrop-blur-md
  "
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_38%,rgba(255,255,255,0.02)_100%)]" />
          <div className="pointer-events-none absolute -left-12 top-0 h-24 w-40 rounded-full bg-lime-200/12 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-32 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative mx-auto flex h-16 items-center justify-between px-4 md:px-6">

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => renderDesktopNavClass(isActive)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:block">
              <NavLink
                to={authed ? PATHS.admin : PATHS.login}
                className="rounded-full border border-white/20 bg-white/6 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition hover:bg-white/12"
              >
                {authed ? "管理後台" : "登入"}
              </NavLink>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:bg-white/14 md:hidden"
            >
              <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={[
            "mt-2 overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,rgba(8,20,16,0.70),rgba(17,36,28,0.58))] shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 border-transparent",
          ].join(" ")}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) => renderMobileNavClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to={authed ? PATHS.admin : PATHS.login}
              onClick={closeMobileMenu}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
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