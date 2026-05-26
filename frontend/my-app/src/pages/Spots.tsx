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

  const spotList = useMemo(() => {
    return places.map(mapPlaceToSpotCardItem);
  }, [places]);

  const stats = useMemo(() => {
    const villages = new Set(
      places.map((place) => getVillageFromAddress(place.address)).filter(Boolean)
    );

    const scenicCount = places.filter((place) => place.type === "SCENIC_SPOT").length;
    const foodCount = places.filter((place) => place.type === "RESTAURANT").length;
    const stayCount = places.filter((place) => place.type === "HOTEL").length;
    const activityCount = places.filter((place) => place.type === "ACTIVITY").length;

    return {
      total: places.length,
      villages: villages.size,
      scenicCount,
      foodCount,
      stayCount,
      activityCount,
    };
  }, [places]);

  return (
    <main
      className="min-h-screen font-sans bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-500"
      style={{
        // 依照目前文字顏色動態產生極淡的網點背景
        backgroundImage: "radial-gradient(color-mix(in srgb, var(--app-text) 10%, transparent) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* 頂部大圖/探索區塊 (Hero Section) */}
      <section className="relative overflow-hidden pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className="relative overflow-hidden rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] backdrop-blur-xl transition-colors duration-500"
            style={{
              boxShadow: "var(--app-shadow)",
            }}
          >
            {/* 裝飾性柔和色塊 */}
            <div
              className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 15%, transparent)" }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: "color-mix(in srgb, var(--app-accent-2) 12%, transparent)" }}
              aria-hidden="true"
            />

            <div className="relative grid gap-10 px-6 py-12 md:px-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div className="flex relative">
                {/* 日系直書裝飾 */}
                <div
                  className="hidden md:block mr-8 text-sm font-medium tracking-[0.4em] opacity-60 text-[var(--app-accent)]"
                  style={{ writingMode: "vertical-rl" }}
                  aria-hidden="true"
                >
                  小半天的日常風景
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--app-accent)]">
                    Xiaobantian
                  </p>

                  <h1 className="mt-4 text-4xl font-black tracking-widest md:text-5xl lg:text-6xl text-[var(--app-text)]">
                    探索小半天
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg text-[var(--app-text-muted)]">
                    從靜謐的竹林步道、茶園秘境到充滿人情味的在地餐飲與住宿。在這裡放慢腳步，感受南投鹿谷鄉的自然地景與地方故事。
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-sm text-[var(--app-text)]">
                      共 {stats.total} 處景點
                    </span>
                    <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-sm text-[var(--app-text)]">
                      涵蓋 {stats.villages} 個聚落
                    </span>
                  </div>
                </div>
              </div>

              {/* 數據統計區塊：日系手繪塗鴉風 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 注入手繪塗鴉專屬的微動畫 */}
                <style>{`
                  @keyframes doodle-float {
                    0%, 100% { transform: translateY(0) rotate(-3deg); }
                    50% { transform: translateY(-5px) rotate(3deg); }
                  }
                  @keyframes doodle-bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                  }
                  /* 模擬手繪筆觸的不規則邊框 */
                  .hand-drawn-border {
                    border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
                  }
                  .hand-drawn-border:hover {
                    border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
                  }
                `}</style>

                {[
                  {
                    label: "自然景點",
                    value: stats.scenicCount,
                    color: "var(--app-accent)", 
                    bgColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                    icon: (
                      <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-float_3s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.5l-5.5-5.5a1.5 1.5 0 00-2 0l-1.5 1.5a1.5 1.5 0 01-2 0L6.5 8a1.5 1.5 0 00-2 0L2 10.5M17 5a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    ),
                    blob: "60% 40% 70% 30% / 40% 50% 60% 50%",
                  },
                  {
                    label: "在地餐廳",
                    value: stats.foodCount,
                    color: "var(--app-accent-2)",
                    bgColor: "color-mix(in srgb, var(--app-accent-2) 15%, transparent)",
                    icon: (
                      <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-bounce_2s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 11h16M4 11a8 8 0 0016 0M4 11V9m16 2V9M8 5v2m4-3v3m4-2v2" />
                      </svg>
                    ),
                    blob: "30% 70% 70% 30% / 50% 50% 50% 50%",
                  },
                  {
                    label: "質感住宿",
                    value: stats.stayCount,
                    color: "var(--app-text-muted)", 
                    bgColor: "color-mix(in srgb, var(--app-text-muted) 12%, transparent)",
                    icon: (
                      <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-float_3.5s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7M4 10v11h16V10M9 21v-6h6v6" />
                      </svg>
                    ),
                    blob: "50% 50% 30% 70% / 60% 40% 60% 40%",
                  },
                  {
                    label: "活動體驗",
                    value: stats.activityCount,
                    color: "var(--app-accent)", 
                    bgColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                    icon: (
                      <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-bounce_2.5s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19s0-14 14-14c0 0-14 0-14 14zm0 0l6-6" />
                      </svg>
                    ),
                    blob: "40% 60% 40% 60% / 70% 30% 70% 30%",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group hand-drawn-border relative flex flex-col items-center justify-center border-2 bg-[var(--app-surface)] px-4 py-5 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-md"
                    style={{
                      borderColor: "color-mix(in srgb, var(--app-border) 80%, transparent)",
                    }}
                  >
                    {/* 背景的可愛有機圓角塗鴉色塊 */}
                    <div 
                      className="absolute top-4 h-12 w-12 transition-all duration-500 group-hover:scale-110"
                      style={{ 
                        backgroundColor: item.bgColor,
                        borderRadius: item.blob 
                      }}
                      aria-hidden="true"
                    />

                    {/* SVG 塗鴉圖示 */}
                    <div 
                      className="relative z-10 mb-2 flex h-10 w-10 items-center justify-center"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>

                    <p className="relative z-10 mb-1 text-xs font-medium tracking-widest text-[var(--app-muted)]">
                      {item.label}
                    </p>

                    <p className="relative z-10 flex items-baseline gap-1 text-3xl font-serif font-bold text-[var(--app-text)]">
                      {item.value}
                      <span className="text-xs font-normal text-[var(--app-muted)]">處</span>
                    </p>
                    
                    {/* 裝飾性的小十字/星號塗鴉 */}
                    <div 
                      className="absolute right-3 top-3 text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                      style={{ color: item.color }}
                    >
                      ✦
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

{/* 分類篩選器 (Category Filter) - 日系竹林風 */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        {/* 注入竹葉微風搖曳的專屬動畫 */}
        <style>{`
          @keyframes bamboo-breeze {
            0%, 100% { transform: rotate(0deg) skewX(0deg); }
            50% { transform: rotate(2deg) skewX(-3deg); }
          }
          .bamboo-leaf-shape {
            /* 模擬竹葉的不對稱切角 (左上、右下大圓角；右上、左下小圓角) */
            border-radius: 20px 4px 20px 4px;
          }
          .bamboo-leaf-shape:hover {
            border-radius: 4px 20px 4px 20px;
          }
        `}</style>

        <div 
          className="relative overflow-hidden rounded-[24px] bg-[var(--app-surface)] px-5 py-5 backdrop-blur-xl md:px-8 md:py-6 transition-colors duration-500 shadow-sm"
          style={{
            border: "1px solid var(--app-border)",
            // 左側加上粗邊框，模擬一根立著的竹子
            borderLeft: "6px solid var(--app-accent)",
          }}
        >
          {/* 背景裝飾：極淡的竹葉剪影 */}
          <svg className="absolute -right-6 -top-6 h-32 w-32 opacity-[0.03] text-[var(--app-accent)] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.41 11.58l-9-9C12.04 2.21 11.53 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .53.21 1.04.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
          </svg>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              {/* 裝飾性的小竹節 Icon */}
              <div 
                className="flex h-8 w-3 flex-col justify-between rounded-full bg-[var(--app-accent)] opacity-80"
                aria-hidden="true"
              >
                <div className="h-[2px] w-full bg-white/40 mt-2"></div>
                <div className="h-[2px] w-full bg-white/40 mb-2"></div>
              </div>
              <h2 className="text-xl font-bold tracking-widest text-[var(--app-text)]">
                尋找你的行程
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {categoryOptions.map((option) => {
                const isActive = selectedType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedType(option.value)}
                    // 使用 bamboo-leaf-shape 類別套用竹葉形狀
                    className={`bamboo-leaf-shape group relative flex items-center gap-2 overflow-hidden px-5 py-2.5 text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--app-accent)] text-[var(--app-bg)] shadow-[0_4px_12px_color-mix(in_srgb,var(--app-accent)_40%,transparent)] animate-[bamboo-breeze_4s_ease-in-out_infinite]"
                        : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-muted)] hover:text-[var(--app-accent)] hover:border-[var(--app-accent)]"
                    }`}
                  >
                    {/* Active 時顯示的微小竹葉 Icon */}
                    {isActive && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.5,3C13.5,3 10,6.5 10,10.5C10,11.5 10.2,12.5 10.5,13.4L3.6,20.4L5,21.8L11.9,14.9C12.8,15.2 13.8,15.4 14.8,15.4C18.8,15.4 22.3,11.9 22.3,7.9L22.5,3H17.5Z" />
                      </svg>
                    )}
                    <span className={isActive ? "font-bold tracking-widest" : "font-medium tracking-wide"}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-[var(--app-muted)] lg:text-right">
              <span className="h-[1px] w-8 bg-[var(--app-border)] lg:hidden"></span>
              顯示 <span className="text-[var(--app-accent)] font-bold text-lg">{spotList.length}</span> 筆結果
            </div>
          </div>
        </div>
      </section>

      {/* 景點卡片列表區塊 */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {loading && (
          <div className="flex h-[40vh] flex-col items-center justify-center rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)]">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
            <p className="mt-4 text-sm tracking-widest text-[var(--app-accent)]">
              正在尋找景點...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[40vh] items-center justify-center rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && spotList.length === 0 && (
          <div className="flex h-[40vh] items-center justify-center rounded-[24px] border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
            <p>目前查無符合條件的景點資料。</p>
          </div>
        )}

        {!loading && !error && spotList.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
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