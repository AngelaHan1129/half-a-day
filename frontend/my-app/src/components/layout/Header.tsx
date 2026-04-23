import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../app/router/paths";

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
        ? "bg-lime-300 text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        : "text-white/80 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const renderMobileNavClass = (isActive: boolean) =>
    [
      mobileLinkBase,
      isActive
        ? "bg-lime-300 text-slate-950"
        : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <NavLink
          to={PATHS.home}
          className="text-lg font-black tracking-tight text-white"
          onClick={closeMobileMenu}
        >
          小半天
        </NavLink>

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
            to={PATHS.login}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            登入
          </NavLink>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={[
          "overflow-hidden border-t border-white/10 bg-slate-950/95 transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
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
            to={PATHS.login}
            onClick={closeMobileMenu}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            登入
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;