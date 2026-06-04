// src/components/common/Pagination.tsx
type PaginationProps = {
  currentPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

const Pagination = ({
  currentPage,
  maxPage,
  onPageChange,
  onNext,
  onPrev,
}: PaginationProps) => {
  if (maxPage <= 1) return null;

  // 產生要顯示的頁碼陣列 (這裡簡單呈現所有頁碼，如果頁數很多可以再做縮略處理)
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* 上一頁按鈕 */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] transition-all hover:bg-[var(--app-accent)] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="上一頁"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 頁碼按鈕 */}
      <div className="flex gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-full font-serif font-bold transition-all ${
              currentPage === page
                ? "bg-[var(--app-accent)] text-white shadow-md shadow-[var(--app-accent)]/30"
                : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 下一頁按鈕 */}
      <button
        onClick={onNext}
        disabled={currentPage === maxPage}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] transition-all hover:bg-[var(--app-accent)] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        aria-label="下一頁"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;