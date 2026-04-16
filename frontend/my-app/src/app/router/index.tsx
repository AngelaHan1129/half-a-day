import { createBrowserRouter } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import { AdminRouteGuard } from "./routeGuards";
import { PATHS } from "./paths";

import Home from "../../pages/Home";
import About from "../../pages/About";
import MapPage from "../../pages/MapPage";
import ARPage from "../../pages/ARPage";
import Login from "../../pages/Login";
import NotFound from "../../pages/NotFound";
import Spots from "../../pages/Spots";
import SoundFlowerPage from "../../pages/SoundFlowerPage";

const PlaceholderPage = ({ title }: { title: string }) => (
  <main className="mx-auto max-w-7xl px-4 py-24 md:px-6">
    <h1 className="text-4xl font-bold text-white">{title}</h1>
  </main>
);

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
      { path: "recommend", element: <PlaceholderPage title="智慧推薦" /> },
      { path: "booking", element: <PlaceholderPage title="線上預約" /> },
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
        path: "dashboard",
        element: <PlaceholderPage title="Admin Dashboard" />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;