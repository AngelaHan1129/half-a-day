import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import aboutBg from "../assets/images/about.jpg";

type LatLngTuple = [number, number];

type SpotMarker = {
  id: string;
  name: string;
  position: LatLngTuple;
  description: string;
};

const center: LatLngTuple = [23.7205, 120.7775];

const markers: SpotMarker[] = [
  {
    id: "xiaobantian-bridge",
    name: "小半天高架橋",
    position: [23.7286, 120.7758],
    description: "全台知名三跨式脊背橋，是進入小半天地區的重要地標。",
  },
  {
    id: "shima-park",
    name: "石馬公園",
    position: [23.7269, 120.7783],
    description: "由舊墓園轉型而成的社區公園，也是小半天入口的代表景點。",
  },
  {
    id: "bamboo-center",
    name: "竹藝工坊小半天旅遊中心",
    position: [23.7269, 120.7783],
    description: "可認識在地竹文化、竹編作品與小半天旅遊資訊的據點。",
  },
  {
    id: "dexing-waterfall",
    name: "德興瀑布",
    position: [23.69517, 120.75596],
    description: "上下雙層瀑布構成的小半天自然景觀代表景點。",
  },
  {
    id: "bantian-bridge",
    name: "半天橋",
    position: [23.7218, 120.7875],
    description: "橫路古道沿線的重要橋點，保有山林步道與聚落往來記憶。",
  },
  {
    id: "changyuan-trail",
    name: "長源圳生態步道",
    position: [23.7304, 120.7816],
    description: "沿著歷史水圳與孟宗竹林而行的生態步道。",
  },
  {
    id: "bamboo-battlefield",
    name: "孟宗竹林古戰場",
    position: [23.7312, 120.7808],
    description: "林爽文事件相關歷史場域，竹林景觀也很有代表性。",
  },
  {
    id: "big-rock-god",
    name: "大石公",
    position: [23.7358, 120.8008],
    description: "小半天地區具地方信仰與地景特色的巨石地標。",
  },
  {
    id: "dalunshan-tea-garden",
    name: "大崙山觀光茶園",
    position: [23.681681, 120.76637],
    description: "可遠眺山景、茶園與銀杏景觀的高海拔觀景區。",
  },
  {
    id: "ginkgo-forest",
    name: "銀杏森林",
    position: [23.7388, 120.7865],
    description: "秋冬熱門景觀區，適合四季旅程延伸。",
  },
];

const categories: Record<string, string> = {
  "xiaobantian-bridge": "地標",
  "shima-park": "聚落",
  "bamboo-center": "文化",
  "dexing-waterfall": "自然",
  "bantian-bridge": "古道",
  "changyuan-trail": "步道",
  "bamboo-battlefield": "歷史",
  "big-rock-god": "信仰",
  "dalunshan-tea-garden": "茶園",
  "ginkgo-forest": "景觀",
};

const getThemeMode = (): "light" | "dark" => {
  const rootTheme = document.documentElement.getAttribute("data-theme");
  if (rootTheme === "light" || rootTheme === "dark") return rootTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const createMarkerIcon = (active: boolean) =>
  divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center">
        ${
          active
            ? `<span class="absolute h-10 w-10 rounded-full animate-ping" style="background: color-mix(in srgb, var(--app-accent) 24%, transparent);"></span>
               <span class="absolute h-14 w-14 rounded-full border" style="border-color: color-mix(in srgb, var(--app-accent) 32%, transparent);"></span>`
            : ""
        }
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300"
          style="
            border-color: ${active ? "var(--app-accent)" : "var(--app-border)"};
            background: var(--app-card);
            box-shadow: ${active ? "0 0 16px color-mix(in srgb, var(--app-accent) 40%, transparent)" : "var(--app-shadow)"};
          "
        >
          <span
            class="h-2.5 w-2.5 rounded-full transition-transform duration-300 ${active ? "scale-110" : ""}"
            style="background: ${active ? "var(--app-accent-2)" : "var(--app-muted)"};"
          ></span>
        </span>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    popupAnchor: [0, -24],
  });

const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 150);
    return () => window.clearTimeout(timer);
  }, [map]);
  return null;
};

const MapFlyController = ({ activeSpot }: { activeSpot: SpotMarker | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!activeSpot) return;
    map.flyTo(activeSpot.position, 15, { animate: true, duration: 1.4 });
  }, [activeSpot, map]);
  return null;
};

const MapPage = () => {
  const [activeId, setActiveId] = useState<string>(markers[0].id);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(getThemeMode());

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setThemeMode(getThemeMode());
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    media.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateTheme);
    };
  }, []);

  const activeSpot = useMemo(
    () => markers.find((m) => m.id === activeId) ?? null,
    [activeId]
  );

  const tileUrl =
    themeMode === "dark"
      ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

  const tileAttribution =
    '&copy; <a href="https://www.stadiamaps.com/" target="_blank" rel="noreferrer">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

  return (
    <main
      className="relative min-h-screen overflow-x-hidden pt-24 pb-16 font-sans transition-colors duration-500"
      style={{ color: "var(--app-text)" }}
    >
      {/* ── 底層清楚照片 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${aboutBg}")`,
          backgroundPosition: "center right",
          filter: "saturate(0.92) brightness(0.98)",
        }}
      />

      {/* ── 柔白霧面遮罩 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(247,246,242,0.96) 0%, rgba(247,246,242,0.90) 22%, rgba(247,246,242,0.72) 46%, rgba(247,246,242,0.38) 70%, rgba(247,246,242,0.16) 88%, rgba(247,246,242,0.08) 100%)",
        }}
      />

      {/* ── 很淡的點點紋理 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--app-text) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.18,
        }}
      />

      {/* ── 頁面內容 ── */}
      <div className="relative z-10">
        <style>{`
          @keyframes doodle-float {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-4px) rotate(1deg); }
          }
          .hand-drawn-map-border {
            border-radius: 20px 255px 20px 225px/225px 20px 255px 20px;
          }
          .hand-drawn-card-border {
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          }
          .leaflet-popup-content-wrapper, .leaflet-popup-tip {
            background: var(--app-card) !important;
            color: var(--app-text) !important;
            border: 1px solid var(--app-border);
            border-radius: 16px;
            box-shadow: var(--app-shadow) !important;
          }
        `}</style>

        {/* 頂部導覽標題 */}
        <section className="relative overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 h-64 w-64 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div
                className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-1 text-xs font-bold tracking-widest text-[var(--app-accent)] mb-3 animate-[doodle-float_3s_ease-in-out_infinite]"
                style={{
                  borderColor: "var(--app-border)",
                  backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, transparent)",
                }}
              >
                ✦ Xiaobantian Story Map
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-wide md:text-5xl text-[var(--app-text)]">
                在竹林與茶園間，
                <span className="block mt-1 text-[var(--app-accent)]">
                  探索小半天的立體旅程
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed md:text-base text-[var(--app-text-muted)]">
                點選左側景點卡片，地圖將會自動平滑飛往對應聚落。這不只是一張傳統地圖，更是一篇能隨著腳步展開的小半天休閒農業區故事集。
              </p>
            </div>

            {/* 右側焦點景點顯示面板 */}
            <div
              className="hand-drawn-card-border relative overflow-hidden border-2 p-5 backdrop-blur-xl transition-all duration-300"
              style={{
                borderColor: "var(--app-border)",
                boxShadow: "var(--app-shadow)",
                borderLeft: "6px solid var(--app-accent-2)",
                backgroundColor: "color-mix(in srgb, var(--app-card) 92%, white)",
              }}
            >
              <p className="text-xs font-bold tracking-widest text-[var(--app-muted)] flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                目前焦點
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-wide text-[var(--app-text)] flex items-center gap-2">
                {activeSpot?.name}
                <span
                  className="text-xs font-normal px-2 py-0.5 rounded-md text-[var(--app-accent)]"
                  style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
                >
                  {categories[activeSpot?.id ?? ""]}
                </span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
                {activeSpot?.description}
              </p>
            </div>
          </div>
        </section>

        {/* 主地圖與選單區域 */}
        <section className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="grid gap-6 xl:grid-cols-[350px_minmax(0,1fr)]">

            {/* 左側手帳風按鈕側欄 */}
            <aside
              className="rounded-[24px] border border-[var(--app-border)] p-4 backdrop-blur-xl h-[50vh] xl:h-[72vh] overflow-y-auto"
              style={{
                boxShadow: "var(--app-shadow)",
                backgroundColor: "color-mix(in srgb, var(--app-surface) 92%, white)",
              }}
            >
              <div className="space-y-3">
                {markers.map((marker, index) => {
                  const active = marker.id === activeId;
                  return (
                    <button
                      key={marker.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveId(marker.id)}
                      className="group w-full rounded-[16px] p-4 text-left border transition-all duration-300 outline-none"
                      style={{
                        borderColor: active
                          ? "var(--app-accent)"
                          : "color-mix(in srgb, var(--app-border) 60%, transparent)",
                        borderStyle: active ? "dashed" : "solid",
                        backgroundColor: active
                          ? "color-mix(in srgb, var(--app-accent) 10%, var(--app-card))"
                          : "color-mix(in srgb, var(--app-card) 92%, white)",
                      }}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors"
                          style={{
                            borderColor: active ? "var(--app-accent)" : "var(--app-border)",
                            backgroundColor: active ? "var(--app-accent)" : "var(--app-surface)",
                            color: active ? "var(--app-bg)" : "var(--app-muted)",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <p className={`font-bold transition-colors text-base ${active ? "text-[var(--app-accent)]" : "text-[var(--app-text)]"}`}>
                              {marker.name}
                            </p>
                            <span
                              className="rounded-md px-2 py-0.5 text-[10px] font-medium border"
                              style={{
                                borderColor: "var(--app-border)",
                                backgroundColor: "var(--app-surface)",
                                color: "var(--app-text-muted)",
                              }}
                            >
                              {categories[marker.id]}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-[var(--app-text-muted)] line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {marker.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* 右側 Leaflet 地圖主面板 */}
            <div className="xl:sticky xl:top-24">
              <div
                className="overflow-hidden rounded-[28px] border border-[var(--app-border)] shadow-md"
                style={{
                  boxShadow: "var(--app-shadow)",
                  backgroundColor: "color-mix(in srgb, var(--app-surface) 92%, white)",
                }}
              >
                <div className="relative h-[55vh] min-h-[400px] w-full xl:h-[72vh]">
                  {/* 地圖內部飄浮提示器 */}
                  <div
                    className="absolute right-4 top-4 z-[500] max-w-[240px] rounded-xl border border-[var(--app-border)] px-4 py-3 backdrop-blur-md shadow-md transition-colors"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--app-card) 85%, transparent)",
                      color: "var(--app-text)",
                    }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--app-accent)]">
                      Now Exploring
                    </p>
                    <p className="mt-1 text-sm font-bold flex items-center gap-1.5 text-[var(--app-text)]">
                      {activeSpot?.name}
                    </p>
                  </div>

                  <MapContainer
                    center={center}
                    zoom={14}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <MapResizeFix />
                    <MapFlyController activeSpot={activeSpot} />
                    <TileLayer attribution={tileAttribution} url={tileUrl} />

                    {markers.map((marker) => {
                      const active = marker.id === activeId;
                      return (
                        <Marker
                          key={marker.id}
                          position={marker.position}
                          icon={createMarkerIcon(active)}
                          eventHandlers={{ click: () => setActiveId(marker.id) }}
                        >
                          <Popup>
                            <div className="min-w-[200px] font-sans">
                              <strong
                                className="text-sm block font-bold border-b pb-1 mb-1.5"
                                style={{ borderColor: "var(--app-border)" }}
                              >
                                {marker.name}
                              </strong>
                              <p className="text-xs leading-relaxed" style={{ color: "var(--app-text-muted)" }}>
                                {marker.description}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>

                {/* 地圖底部裝飾面板 */}
                <div
                  className="border-t border-[var(--app-border)] px-5 py-3"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--app-card) 92%, white)",
                    color: "var(--app-text)",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--app-accent)] animate-pulse" />
                      <p className="text-xs font-bold tracking-wider text-[var(--app-text-muted)]">
                        小半天區域節點探索中
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-xs text-[var(--app-bg)] font-bold transition-all"
                        style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))" }}
                      >
                        {categories[activeSpot?.id ?? markers[0].id]}
                      </span>
                      <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-[11px] text-[var(--app-muted)] flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <polyline points="9 21 3 21 3 15"></polyline>
                          <line x1="21" y1="3" x2="14" y2="10"></line>
                          <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                        支援無縫縮放飛躍
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default MapPage;