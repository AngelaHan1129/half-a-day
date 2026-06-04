import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import SpotCard, { type SpotCardItem } from "../components/common/SpotCard";
import { placeApi } from "../services/api/placeApi";
import type { Place, PlaceType } from "../types/place";
import aboutBg from "../assets/images/about.jpg";

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

  const spotList = useMemo(() => places.map(mapPlaceToSpotCardItem), [places]);

  const stats = useMemo(() => {
    const villages = new Set(
      places.map((p) => getVillageFromAddress(p.address)).filter(Boolean)
    );
    return {
      total: places.length,
      villages: villages.size,
      scenicCount: places.filter((p) => p.type === "SCENIC_SPOT").length,
      foodCount: places.filter((p) => p.type === "RESTAURANT").length,
      stayCount: places.filter((p) => p.type === "HOTEL").length,
      activityCount: places.filter((p) => p.type === "ACTIVITY").length,
    };
  }, [places]);

  return (
    <>
      {/* ===== 全頁固定背景 ===== */}
      {/* 底層清楚照片 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${aboutBg}")`,
          backgroundPosition: "center right",
          filter: "saturate(0.92) brightness(0.98)",
        }}
      />

      {/* 柔白霧面遮罩 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(247,246,242,0.96) 0%, rgba(247,246,242,0.90) 22%, rgba(247,246,242,0.72) 46%, rgba(247,246,242,0.38) 70%, rgba(247,246,242,0.16) 88%, rgba(247,246,242,0.08) 100%)",
        }}
      />

      {/* 很淡的點點紋理 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--app-text) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.18,
        }}
      />

      {/* ===== 頁面主體 ===== */}
      <main
        className="relative min-h-screen overflow-x-hidden px-4 pb-16 pt-24 font-sans transition-colors duration-500 md:px-8"
        style={{ color: "var(--app-text)" }}
      >
        <style>{`
          @keyframes doodle-float {
            0%, 100% { transform: translateY(0) rotate(-3deg); }
            50% { transform: translateY(-5px) rotate(3deg); }
          }
          @keyframes doodle-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes bamboo-breeze {
            0%, 100% { transform: rotate(0deg) skewX(0deg); }
            50% { transform: rotate(2deg) skewX(-3deg); }
          }
          .hand-drawn-border {
            border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          }
          .hand-drawn-border:hover {
            border-radius: 15px 255px 15px 225px / 225px 15px 255px 15px;
          }
          .bamboo-leaf-shape {
            border-radius: 20px 4px 20px 4px;
          }
          .bamboo-leaf-shape:hover {
            border-radius: 4px 20px 4px 20px;
          }
        `}</style>

        <div
          className="relative z-10 mx-auto max-w-6xl"
          style={{ minHeight: "calc(100vh - 6rem)" }}
        >

          {/* ── Hero Section ── */}
          <section className="mb-8">
            <div
              className="relative overflow-hidden rounded-[24px] border p-6 shadow-sm backdrop-blur-xl transition-colors duration-500 md:px-10 md:py-10"
              style={{
                borderColor: "var(--app-border)",
                boxShadow: "0 10px 30px color-mix(in srgb, var(--app-text) 8%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--app-surface) 92%, white)",
              }}
            >
              {/* 裝飾色塊 */}
              <div
                className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "color-mix(in srgb, var(--app-accent-2) 10%, transparent)" }}
                aria-hidden="true"
              />

              <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                {/* 左側文字 */}
                <div className="relative flex">
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
                      <span
                        className="rounded-full border px-4 py-2 text-sm text-[var(--app-text)]"
                        style={{
                          borderColor: "var(--app-border)",
                          backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                        }}
                      >
                        共 {stats.total} 處景點
                      </span>
                      <span
                        className="rounded-full border px-4 py-2 text-sm text-[var(--app-text)]"
                        style={{
                          borderColor: "var(--app-border)",
                          backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                        }}
                      >
                        涵蓋 {stats.villages} 個聚落
                      </span>
                    </div>
                  </div>
                </div>

                {/* 右側統計卡 */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "自然景點",
                      value: stats.scenicCount,
                      color: "var(--app-accent)",
                      bgColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                      blob: "60% 40% 70% 30% / 40% 50% 60% 50%",
                      icon: (
                        <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-float_3s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.5l-5.5-5.5a1.5 1.5 0 00-2 0l-1.5 1.5a1.5 1.5 0 01-2 0L6.5 8a1.5 1.5 0 00-2 0L2 10.5M17 5a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      ),
                    },
                    {
                      label: "在地餐廳",
                      value: stats.foodCount,
                      color: "var(--app-accent-2)",
                      bgColor: "color-mix(in srgb, var(--app-accent-2) 15%, transparent)",
                      blob: "30% 70% 70% 30% / 50% 50% 50% 50%",
                      icon: (
                        <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-bounce_2s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 11h16M4 11a8 8 0 0016 0M4 11V9m16 2V9M8 5v2m4-3v3m4-2v2" />
                        </svg>
                      ),
                    },
                    {
                      label: "質感住宿",
                      value: stats.stayCount,
                      color: "var(--app-text-muted)",
                      bgColor: "color-mix(in srgb, var(--app-text-muted) 12%, transparent)",
                      blob: "50% 50% 30% 70% / 60% 40% 60% 40%",
                      icon: (
                        <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-float_3.5s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7M4 10v11h16V10M9 21v-6h6v6" />
                        </svg>
                      ),
                    },
                    {
                      label: "活動體驗",
                      value: stats.activityCount,
                      color: "var(--app-accent)",
                      bgColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                      blob: "40% 60% 40% 60% / 70% 30% 70% 30%",
                      icon: (
                        <svg className="h-7 w-7 transition-all duration-300 group-hover:animate-[doodle-bounce_2.5s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19s0-14 14-14c0 0-14 0-14 14zm0 0l6-6" />
                        </svg>
                      ),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="group hand-drawn-border relative flex flex-col items-center justify-center border-2 px-4 py-5 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-md"
                      style={{
                        borderColor: "var(--app-border)",
                        backgroundColor: "color-mix(in srgb, var(--app-card) 92%, white)",
                      }}
                    >
                      <div
                        className="absolute top-4 h-12 w-12 transition-all duration-500 group-hover:scale-110"
                        style={{ backgroundColor: item.bgColor, borderRadius: item.blob }}
                        aria-hidden="true"
                      />
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 分類篩選器 ── */}
          <section className="mb-8">
            <div
              className="relative overflow-hidden rounded-[24px] border p-5 shadow-sm backdrop-blur-xl transition-colors duration-500 md:px-8 md:py-6"
              style={{
                borderColor: "var(--app-border)",
                boxShadow: "0 10px 30px color-mix(in srgb, var(--app-text) 8%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--app-surface) 92%, white)",
                borderLeft: "6px solid var(--app-accent)",
              }}
            >
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-3 flex-col justify-between rounded-full bg-[var(--app-accent)] opacity-80"
                    aria-hidden="true"
                  >
                    <div className="mt-2 h-[2px] w-full bg-white/40" />
                    <div className="mb-2 h-[2px] w-full bg-white/40" />
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
                        className={`bamboo-leaf-shape group relative flex items-center gap-2 overflow-hidden px-5 py-2.5 text-sm transition-all duration-300 ${isActive ? "animate-[bamboo-breeze_4s_ease-in-out_infinite]" : ""
                          }`}
                        style={
                          isActive
                            ? ({
                              backgroundColor: "var(--app-accent)",
                              color: "var(--app-bg)",
                              boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 40%, transparent)",
                            } as CSSProperties)
                            : ({
                              border: "1px solid var(--app-border)",
                              backgroundColor: "color-mix(in srgb, var(--app-card) 90%, white)",
                              color: "var(--app-muted)",
                            } as CSSProperties)
                        }
                      >
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
                  <span className="h-[1px] w-8 bg-[var(--app-border)] lg:hidden" />
                  顯示{" "}
                  <span className="text-[var(--app-accent)] font-bold text-lg">
                    {spotList.length}
                  </span>{" "}
                  筆結果
                </div>
              </div>
            </div>
          </section>

          {/* ── 景點卡片列表 ── */}
          <section>
            {loading && (
              <div className="flex h-[40vh] flex-col items-center justify-center py-10">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent" />
                <p className="mt-4 text-sm tracking-widest text-[var(--app-accent)]">
                  正在尋找景點...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-[20px] border border-red-200 bg-red-50/70 p-6 text-center text-red-500 backdrop-blur-md">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && spotList.length === 0 && (
              <div className="rounded-[20px] border border-[var(--app-border)] bg-[var(--app-surface)]/85 p-12 text-center text-[var(--app-text-muted)] backdrop-blur-md">
                <p>目前查無符合條件的景點資料。</p>
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

        </div>
      </main>
    </>
  );
};

export default Spots;