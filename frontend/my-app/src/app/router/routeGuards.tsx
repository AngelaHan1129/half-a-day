import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";
import {
  getAdminToken,
  isAdminTokenExpired,
  logoutAdmin,
} from "../../services/api/authStorage";

export const AdminRouteGuard = () => {
  const location = useLocation();

  const token = getAdminToken();
  const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
  const role = localStorage.getItem("admin_role");

  if (!token || isAdminTokenExpired(token)) {
    logoutAdmin();
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  if (!isAuthenticated || role !== "ROLE_ADMIN") {
    logoutAdmin();
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};