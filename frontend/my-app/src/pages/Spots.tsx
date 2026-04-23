import { useEffect, useMemo, useState } from "react";
import SpotCard, { type SpotCardItem } from "../components/common/SpotCard";
import { placeApi } from "../services/api/placeApi";
import type { Place, PlaceType } from "../types/place";

const categoryOptions: { label: string; value: "ALL" | PlaceType }[] = [
  { label: "全部", value: "ALL" },
  { label: "自然景點", value: "SCENIC_SPOT" },
  { label: "餐廳", value: "RESTAURANT" },
  { label: "住宿", value: "HOTEL" },
  { label: "活動體驗", value: "ACTIVITY" },
];

const placeTypeLabelMap: Record<PlaceType, string> = {
  SCENIC_SPOT: "景點",
  RESTAURANT: "餐廳",
  HOTEL: "住宿",
  ACTIVITY: "活動體驗",
};

function getVillageFromAddress(address: string | null): string {
  if (!address) return "小半天地區";

  if (address.includes("竹林")) return "竹林村";
  if (address.includes("和雅")) return "和雅村";
  if (address.includes("竹豐")) return "竹豐村";

  return "小半天地區";
}

function getImageFromPlace(place: Place): string {
  if (place.imageUrls && place.imageUrls.trim()) {
    const firstImage = place.imageUrls
      .split(",")
      .map((item) => item.trim())
      .find(Boolean);

    if (firstImage) return firstImage;
  }

  return `https://picsum.photos/seed/place-${place.id}/900/700`;
}

function mapPlaceToSpotCardItem(place: Place): SpotCardItem {
  return {
    id: String(place.id),
    name: place.name,
    village: getVillageFromAddress(place.address),
    category: placeTypeLabelMap[place.type] ?? place.type,
    description: place.description || "目前尚無景點描述。",
    image: getImageFromPlace(place),
  };
}

const Spots = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | PlaceType>("ALL");

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          selectedType === "ALL"
            ? await placeApi.getAll()
            : await placeApi.getByType(selectedType);

        setPlaces(data);
      } catch (err) {
        console.error(err);
        setError("載入景點資料失敗，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [selectedType]);

  const spotList = useMemo<SpotCardItem[]>(() => {
    return places.map(mapPlaceToSpotCardItem);
  }, [places]);

  return (
    <main className="bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.14),transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="text-sm uppercase tracking-[0.24em] text-lime-300">
            Scenic Spots
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
            探索小半天景點
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            從竹林、瀑布到銀杏森林，將自然地景、地方歷史與四季活動整合成可互動探索的景點導覽。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {categoryOptions.map((option) => {
            const isActive = selectedType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedType(option.value)}
                className={
                  isActive
                    ? "rounded-full bg-lime-300 px-4 py-2 text-sm font-bold text-slate-950"
                    : "rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-white/70">
            載入景點中...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-6 py-10 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && spotList.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-white/70">
            目前查無符合條件的景點資料。
          </div>
        )}

        {!loading && !error && spotList.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {spotList.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Spots;