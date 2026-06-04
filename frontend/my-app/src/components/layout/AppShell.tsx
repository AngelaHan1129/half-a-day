import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppShell = () => {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
};

export default AppShell;