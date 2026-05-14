import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppShell = () => {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <Header />
      <Outlet />
      <footer
        className="border-t transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-bg)",
          color: "var(--app-muted)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm md:px-6">
          小半天休閒農業區智慧農遊平台
        </div>
      </footer>
    </div>
  );
};

export default AppShell;