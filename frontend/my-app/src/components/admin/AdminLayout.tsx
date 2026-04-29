import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { PATHS } from "../../app/router/paths";

type Props = {
  children: ReactNode;
};

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/places", label: "Places" },
  { to: "/admin/routes", label: "Routes" },
  { to: "/admin/knowledge", label: "Knowledge" },
  { to: "/admin/sound-flowers", label: "Sound Flowers" },
];

export default function AdminLayout({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-lime-300">
              Half a Day
            </p>
            <h1 className="mt-2 text-2xl font-black">管理者介面</h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              管理景點、路線、知識庫與聲音花資料。
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  [
                    "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-lime-300 text-slate-950"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 lg:hidden"
              >
                Menu
              </button>

              <div className="ml-auto flex items-center gap-3">
                <Link
                  to={PATHS.home}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-lime-300 hover:text-lime-300"
                >
                  回到使用者介面
                </Link>
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 md:block">
                  Admin Console
                </div>
                <div className="h-10 w-10 rounded-full bg-lime-300" />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}