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

const createMarkerIcon = (active: boolean) =>
  divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center">
        ${active
        ? `<span class="absolute h-10 w-10 rounded-full bg-lime-400/30 animate-ping"></span>
               <span class="absolute h-14 w-14 rounded-full border border-lime-300/35"></span>`
        : ""
      }
        <span class="flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-slate-950 shadow-[0_0_0_4px_rgba(163,230,53,0.18)]">
          <span class="h-2.5 w-2.5 rounded-full ${active ? "bg-lime-300" : "bg-white"}"></span>
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

  const activeSpot = useMemo(
    () => markers.find((marker) => marker.id === activeId) ?? null,
    [activeId]
  );

  return (
    <main className="min-h-screen bg-[#07120d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.22),transparent_32%),radial-gradient(circle_at_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,#07120d_0%,#0b1b14_52%,#10231a_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-lime-300/90">
              Xiaobantian Story Map
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              在竹林、古道與山霧之間，
              <span className="block text-lime-300">探索小半天的立體旅程</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              這不是單純景點地圖，而是一張可以跟著故事走的探索介面。
              點選左側景點卡片，地圖會帶你飛往對應位置，像沿著山城的脈絡一路展開。
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              焦點景點
            </p>
            <h2 className="mt-3 text-2xl font-bold text-lime-300">
              {activeSpot?.name}
            </h2>
            <p className="mt-3 leading-8 text-white/72">
              {activeSpot?.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="space-y-3">
              {markers.map((marker, index) => {
                const active = marker.id === activeId;

                return (
                  <button
                    key={marker.id}
                    type="button"
                    onClick={() => setActiveId(marker.id)}
                    className={`group w-full rounded-[24px] border p-4 text-left transition duration-300 ${active
                      ? "border-lime-300/40 bg-lime-300/12 shadow-[0_18px_50px_rgba(132,204,22,0.12)]"
                      : "border-white/8 bg-[#0d1b15] hover:border-white/20 hover:bg-[#12211a]"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold ${active
                          ? "border-lime-300/40 bg-lime-300/15 text-lime-200"
                          : "border-white/10 bg-white/5 text-white/70"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={active ? "font-semibold text-lime-200" : "font-semibold text-white"}>
                            {marker.name}
                          </p>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50">
                            {categories[marker.id]}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-7 text-white/60">
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
  <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#dce8dd] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
    <div className="relative h-[62vh] min-h-[420px] w-full md:h-[72vh] lg:h-[76vh]">
      <div className="absolute left-4 top-4 z-[500] max-w-[280px] rounded-2xl border border-white/15 bg-slate-950/78 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-lime-300/80">
          Now Exploring
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          {activeSpot?.name}
        </p>
        <p className="mt-1 text-xs leading-6 text-white/65">
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

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => {
          const active = marker.id === activeId;

          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={createMarkerIcon(active)}
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

    <div className="border-t border-black/10 bg-[#f4f8f2] px-5 py-4 text-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Focus Point
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {activeSpot?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
            {categories[activeSpot?.id ?? markers[0].id]}
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600">
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