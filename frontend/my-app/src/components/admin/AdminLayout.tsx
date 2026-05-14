import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <div className="flex min-h-screen">
        {open && (
          <button
            type="button"
            aria-label="關閉側邊選單"
            onClick={handleCloseSidebar}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r p-6 backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            borderColor: "var(--app-border)",
            background: "color-mix(in srgb, var(--app-card) 92%, transparent)",
            color: "var(--app-text)",
          }}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: "var(--app-accent)" }}
              >
                Half a Day
              </p>

              <h1 className="mt-2 text-2xl font-black">管理者介面</h1>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--app-text-muted)" }}
              >
                管理景點、路線、知識庫與聲音花資料。
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseSidebar}
              className="rounded-xl border px-3 py-2 text-sm transition-colors duration-300 lg:hidden"
              style={{
                borderColor: "var(--app-border)",
                color: "var(--app-text)",
                background: "var(--app-surface)",
              }}
            >
              關閉
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={handleCloseSidebar}
                className="block rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300"
                style={({ isActive }) => ({
                  background: isActive ? "var(--app-accent)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--app-text-muted)",
                  boxShadow: isActive ? "var(--app-shadow)" : "none",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className="sticky top-0 z-20 border-b backdrop-blur transition-colors duration-300"
            style={{
              borderColor: "var(--app-border)",
              background:
                "color-mix(in srgb, var(--app-bg) 82%, transparent)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl border px-3 py-2 text-sm transition-colors duration-300 lg:hidden"
                style={{
                  borderColor: "var(--app-border)",
                  color: "var(--app-text)",
                  background: "var(--app-card)",
                }}
              >
                {open ? "Close" : "Menu"}
              </button>

              <div className="ml-auto flex items-center gap-3">
                <Link
                  to={PATHS.home}
                  className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-300"
                  style={{
                    borderColor: "var(--app-border)",
                    color: "var(--app-text)",
                    background: "transparent",
                  }}
                >
                  回到使用者介面
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-300"
                  style={{
                    borderColor: "rgba(239, 68, 68, 0.28)",
                    color: "#dc2626",
                    background: "transparent",
                  }}
                >
                  登出
                </button>

                <div
                  className="hidden rounded-full border px-4 py-2 text-sm md:block"
                  style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-card)",
                    color: "var(--app-text-muted)",
                  }}
                >
                  Admin Console
                </div>

                <div
                  className="h-10 w-10 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                  }}
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}