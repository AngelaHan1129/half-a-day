import { PATHS } from "../../app/router/paths";

export type NavItem = {
  label: string;
  to: string;
  end?: boolean;
};

export const navItems: NavItem[] = [
  { label: "首頁", to: PATHS.home, end: true },
  { label: "關於小半天", to: PATHS.about },
  { label: "景點導覽", to: PATHS.spots },
  { label: "遊程路線", to: PATHS.routes },
  { label: "建立預約", to: PATHS.booking },
  { label: "智慧推薦", to: PATHS.recommend },
  { label: "互動地圖", to: PATHS.map },
  { label: "AR 體驗", to: PATHS.ar },
  { label: "聲音之花", to: PATHS.soundFlower },
];

export const desktopLinkBase =
  "rounded-full px-4 py-2 text-sm font-medium transition duration-200";

export const mobileLinkBase =
  "rounded-2xl px-4 py-3 text-sm font-medium transition";