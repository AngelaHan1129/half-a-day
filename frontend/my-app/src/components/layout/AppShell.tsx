import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <Outlet />
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60 md:px-6">
          小半天休閒農業區智慧農遊平台
        </div>
      </footer>
    </div>
  );
};

export default AppShell;