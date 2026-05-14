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

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const createMarkerIcon = (active: boolean, mode: "light" | "dark") =>
  divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center">
        ${
          active
            ? `<span class="absolute h-10 w-10 rounded-full animate-ping" style="background: rgba(139, 92, 246, 0.24);"></span>
               <span class="absolute h-14 w-14 rounded-full border" style="border-color: rgba(139, 92, 246, 0.32);"></span>`
            : ""
        }
        <span
          class="flex h-5 w-5 items-center justify-center rounded-full border"
          style="
            border-color: ${mode === "dark" ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.35)"};
            background: ${mode === "dark" ? "#111827" : "#ffffff"};
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.18);
          "
        >
          <span
            class="h-2.5 w-2.5 rounded-full"
            style="background: ${active ? "#8b5cf6" : mode === "dark" ? "#ffffff" : "#334155"};"
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
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
};

const MapFlyController = ({
  activeSpot,
}: {
  activeSpot: SpotMarker | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!activeSpot) return;

    map.flyTo(activeSpot.position, 15, {
      animate: true,
      duration: 1.4,
    });
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
    () => markers.find((marker) => marker.id === activeId) ?? null,
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
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, color-mix(in srgb, var(--app-accent) 22%, transparent) 0%, transparent 32%), radial-gradient(circle at right, color-mix(in srgb, var(--app-accent-2) 16%, transparent) 0%, transparent 28%), linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 90%, #0f172a 10%) 0%, color-mix(in srgb, var(--app-bg) 94%, #111827 6%) 52%, var(--app-bg) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent, color-mix(in srgb, var(--app-text) 10%, transparent))",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p
              className="text-sm uppercase tracking-[0.32em]"
              style={{ color: "var(--app-accent-2)" }}
            >
              Xiaobantian Story Map
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              在竹林、古道與山霧之間，
              <span
                className="block"
                style={{ color: "var(--app-accent)" }}
              >
                探索小半天的立體旅程
              </span>
            </h1>

            <p
              className="mt-6 max-w-2xl text-base leading-8 md:text-lg"
              style={{ color: "var(--app-text-muted)" }}
            >
              這不是單純景點地圖，而是一張可以跟著故事走的探索介面。
              點選左側景點卡片，地圖會帶你飛往對應位置，像沿著山城的脈絡一路展開。
            </p>
          </div>

          <div
            className="rounded-[28px] border p-5 backdrop-blur-xl"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-card)",
              boxShadow: "var(--app-shadow)",
            }}
          >
            <p
              className="text-sm uppercase tracking-[0.2em]"
              style={{ color: "var(--app-text-muted)" }}
            >
              焦點景點
            </p>
            <h2
              className="mt-3 text-2xl font-bold"
              style={{ color: "var(--app-accent)" }}
            >
              {activeSpot?.name}
            </h2>
            <p
              className="mt-3 leading-8"
              style={{ color: "var(--app-text-muted)" }}
            >
              {activeSpot?.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            className="rounded-[30px] border p-4 backdrop-blur-xl"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-card)",
              boxShadow: "var(--app-shadow)",
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
                    className="group w-full rounded-[24px] border p-4 text-left transition duration-300"
                    style={
                      active
                        ? {
                            borderColor: "color-mix(in srgb, var(--app-accent) 34%, transparent)",
                            background:
                              "color-mix(in srgb, var(--app-accent) 10%, var(--app-card))",
                            boxShadow: "0 18px 50px rgba(99, 102, 241, 0.12)",
                          }
                        : {
                            borderColor: "var(--app-border)",
                            background:
                              "color-mix(in srgb, var(--app-card) 86%, var(--app-bg) 14%)",
                          }
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold"
                        style={
                          active
                            ? {
                                borderColor:
                                  "color-mix(in srgb, var(--app-accent) 36%, transparent)",
                                background:
                                  "color-mix(in srgb, var(--app-accent) 14%, transparent)",
                                color: "var(--app-accent)",
                              }
                            : {
                                borderColor: "var(--app-border)",
                                background: "var(--app-surface)",
                                color: "var(--app-text-muted)",
                              }
                        }
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className="font-semibold"
                            style={{
                              color: active
                                ? "var(--app-accent)"
                                : "var(--app-text)",
                            }}
                          >
                            {marker.name}
                          </p>

                          <span
                            className="rounded-full border px-2.5 py-1 text-[11px]"
                            style={{
                              borderColor: "var(--app-border)",
                              background: "var(--app-surface)",
                              color: "var(--app-text-muted)",
                            }}
                          >
                            {categories[marker.id]}
                          </span>
                        </div>

                        <p
                          className="mt-2 text-sm leading-7"
                          style={{ color: "var(--app-text-muted)" }}
                        >
                          {marker.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="lg:sticky lg:top-6">
            <div
              className="overflow-hidden rounded-[34px] border"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
                boxShadow: "var(--app-shadow)",
              }}
            >
              <div className="relative h-[62vh] min-h-[420px] w-full md:h-[72vh] lg:h-[76vh]">
                <div
                  className="absolute left-4 top-4 z-[500] max-w-[280px] rounded-2xl border px-4 py-3 backdrop-blur-xl"
                  style={{
                    borderColor: "var(--app-border)",
                    background:
                      themeMode === "dark"
                        ? "rgba(15, 23, 42, 0.76)"
                        : "rgba(255, 255, 255, 0.86)",
                    color: "var(--app-text)",
                    boxShadow: "var(--app-shadow)",
                  }}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: "var(--app-accent-2)" }}
                  >
                    Now Exploring
                  </p>
                  <p className="mt-1 text-sm font-semibold">{activeSpot?.name}</p>
                  <p
                    className="mt-1 text-xs leading-6"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {activeSpot?.description}
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
                        icon={createMarkerIcon(active, themeMode)}
                        eventHandlers={{
                          click: () => setActiveId(marker.id),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[220px]">
                            <strong className="text-base">{marker.name}</strong>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {marker.description}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              <div
                className="border-t px-5 py-4"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-card)",
                  color: "var(--app-text)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.18em]"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      Focus Point
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {activeSpot?.name}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                      }}
                    >
                      {categories[activeSpot?.id ?? markers[0].id]}
                    </span>

                    <span
                      className="rounded-full border px-3 py-1 text-xs"
                      style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-surface)",
                        color: "var(--app-text-muted)",
                      }}
                    >
                      點卡片切換焦點
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MapPage;