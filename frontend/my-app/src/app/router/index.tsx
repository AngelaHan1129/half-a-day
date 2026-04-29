import { createBrowserRouter } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import PlaceholderPage from "../../components/common/PlaceholderPage";
import AdminShell from "../../components/admin/AdminShell";
import { AdminRouteGuard } from "./routeGuards";
import { PATHS } from "./paths";

import Home from "../../pages/Home";
import About from "../../pages/About";
import Booking from "../../pages/Booking";
import MapPage from "../../pages/MapPage";
import ARPage from "../../pages/ARPage";
import Login from "../../pages/Login";
import NotFound from "../../pages/NotFound";
import Spots from "../../pages/Spots";
import Recommend from "../../pages/Recommend";
import SoundFlowerPage from "../../pages/SoundFlowerPage";

import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminPlaces from "../../pages/admin/AdminPlaces";
import AdminKnowledge from "../../pages/admin/AdminKnowledge";
import AdminSoundFlowers from "../../pages/admin/AdminSoundFlowers";
import AdminRoutes from "../../pages/admin/AdminRoutes";

const router = createBrowserRouter([
  {
    path: PATHS.home,
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "spots", element: <Spots /> },
      { path: "seasons", element: <PlaceholderPage title="四季旅程" /> },
      { path: "routes", element: <PlaceholderPage title="路線規劃" /> },
      { path: "experiences", element: <PlaceholderPage title="體驗活動" /> },
      { path: "map", element: <MapPage /> },
      { path: "recommend", element: <Recommend /> },
      { path: "booking", element: <Booking /> },
      { path: "ar", element: <ARPage /> },
      { path: "sound-flower", element: <SoundFlowerPage /> },
      { path: "news", element: <PlaceholderPage title="最新消息" /> },
      { path: "faq", element: <PlaceholderPage title="常見問題" /> },
      { path: "contact", element: <PlaceholderPage title="聯絡我們" /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: PATHS.admin,
    element: <AdminRouteGuard />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "places", element: <AdminPlaces /> },
          { path: "routes", element: <AdminRoutes /> },
          { path: "knowledge", element: <AdminKnowledge /> },
          { path: "sound-flowers", element: <AdminSoundFlowers /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;