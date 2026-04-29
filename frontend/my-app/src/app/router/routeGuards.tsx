import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";
import { isAuthenticated } from "../../services/api/auth";

export const AdminRouteGuard = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};