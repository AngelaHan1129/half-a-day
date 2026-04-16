import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
      }}
    >
      <aside
        style={{
          padding: "24px",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          background: "#111827",
          color: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin</h2>
        <nav style={{ display: "grid", gap: "12px" }}>
          <span>Dashboard</span>
          <span>Spots</span>
          <span>Routes</span>
          <span>Bookings</span>
        </nav>
      </aside>

      <main style={{ padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;