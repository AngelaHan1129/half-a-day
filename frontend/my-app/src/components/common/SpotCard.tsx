import { Link } from "react-router-dom";

export type SpotCardItem = {
  id: string;
  name: string;
  village: string;
  category: string;
  description: string;
  image: string;
};

type SpotCardProps = {
  spot: SpotCardItem;
};

const SpotCard = ({ spot }: SpotCardProps) => {
  return (
    <article
      // 改為標準的工整大圓角 (rounded-[24px])，保留優雅的上浮動畫與陰影
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[var(--app-border)] bg-[var(--app-card)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl"
      style={{
        boxShadow: "var(--app-shadow)",
      }}
    >
      {/* 圖片區塊：恢復方正比例，依靠外層的 overflow-hidden 呈現完美圓角 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          // Hover 時圖片優雅地緩慢放大
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* 分類標籤：轉正的日系手帳風紙籤 */}
        <div
          className="absolute left-4 top-4 z-10 rounded-[10px] px-3 py-1.5 text-xs font-bold tracking-widest backdrop-blur-md transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: "color-mix(in srgb, var(--app-surface) 90%, transparent)",
            color: "var(--app-accent)",
            // 保留一點點手作感的虛線邊框
            border: "1px dashed color-mix(in srgb, var(--app-accent) 45%, transparent)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}
        >
          {spot.category}
        </div>
      </div>

      {/* 內文區塊 */}
      <div className="flex flex-1 flex-col px-5 py-6">
        <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[var(--app-accent-2)]">
          {spot.village}
        </p>

        <h3 className="relative mb-3 flex items-center gap-2 text-xl font-bold tracking-wide md:text-2xl text-[var(--app-text)]">
          {spot.name}
          {/* Hover 時出現的裝飾性塗鴉小星星，增加可愛度 */}
          <span 
            className="text-[14px] text-[var(--app-accent)] opacity-0 transition-all duration-300 group-hover:rotate-12 group-hover:opacity-80"
            aria-hidden="true"
          >
            ✦
          </span>
        </h3>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
          {spot.description}
        </p>

        {/* 底部連結：簡約日系文字按鈕 */}
        <div className="mt-auto pt-2">
          <Link
            to={`/spots/${spot.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 text-[var(--app-accent)] hover:text-[var(--app-text)]"
          >
            <span className="relative pb-1">
              查看景點
              {/* Hover 時從左到右畫出的底線 */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--app-accent)] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </span>
            <span 
              className="transition-transform duration-300 group-hover:translate-x-1" 
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SpotCard;