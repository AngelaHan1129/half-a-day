import type { RouteObject } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminDashboard from "../../pages/admin/AdminDashboard";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    ),
  },
];