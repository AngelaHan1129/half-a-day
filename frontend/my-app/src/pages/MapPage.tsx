import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type LatLngTuple = [number, number];

type SpotMarker = {
  id: string;
  name: string;
  position: LatLngTuple;
  description: string;
};

const center: LatLngTuple = [23.7265, 120.7785];

const markers: SpotMarker[] = [
  {
    id: "bamboo-battlefield",
    name: "孟宗竹林古戰場",
    position: [23.7312, 120.7808],
    description: "竹林與歷史故事交織的代表性景點。",
  },
  {
    id: "dexing-waterfall",
    name: "德興瀑布",
    position: [23.7248, 120.7762],
    description: "瀑布與山林步道構成的自然景觀節點。",
  },
  {
    id: "ginkgo-forest",
    name: "銀杏森林",
    position: [23.7388, 120.7865],
    description: "秋冬熱門景觀區，適合四季旅程延伸。",
  },
];

const MapPage = () => {
  return (
    <main className="bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <p className="text-sm uppercase tracking-[0.24em] text-lime-300">
            Interactive Map
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            小半天互動地圖
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            透過真實地圖瀏覽小半天景點位置，後續可再擴充村落圖層、遊程路線與商家點位。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <h2 className="text-xl font-bold">景點列表</h2>
            <div className="mt-5 space-y-3">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <p className="text-sm font-semibold text-lime-300">
                    {marker.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    {marker.description}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white">
            <MapContainer
              center={center}
              zoom={14}
              scrollWheelZoom={true}
              className="h-[65vh] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                  <Popup>
                    <div>
                      <strong>{marker.name}</strong>
                      <p>{marker.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MapPage;