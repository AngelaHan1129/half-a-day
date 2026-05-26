type DurationSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

const durationOptions = [
  { label: "2 小時", value: 2 },
  { label: "3 小時", value: 3 },
  { label: "4 小時", value: 4 },
  { label: "5 小時", value: 5 },
  { label: "6 小時", value: 6 },
];

export default function DurationSelector({
  value,
  onChange,
}: DurationSelectorProps) {
  return (
    <div className="space-y-3">
      {/* 延續竹林風與幾何竹葉圓角切角語彙 */}
      <style>{`
        .bamboo-leaf-btn {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-btn:hover:not([aria-pressed="true"]) {
          border-radius: 4px 16px 4px 16px;
        }
      `}</style>

      <label className="text-sm font-bold flex items-center gap-2 text-[var(--app-text)]">
        {/* 極簡線條時鐘 Icon SVG */}
        <span className="text-[var(--app-accent)]" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </span>
        可安排時數
      </label>

      <div className="flex flex-wrap gap-3">
        {durationOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`bamboo-leaf-btn px-5 py-2.5 text-sm font-medium transition-all duration-300 border ${
                active
                  ? "font-bold text-[var(--app-accent)]"
                  : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-accent)] hover:border-[var(--app-accent)]"
              }`}
              style={{
                // 作用中狀態：與主題選擇器呼應的半透明和風印章刷色，兼顧明暗雙主題質感
                borderColor: active ? "var(--app-accent)" : "var(--app-border)",
                borderStyle: active ? "dashed" : "solid", // 激活時切換為手帳虛線質感
                background: active ? "color-mix(in srgb, var(--app-accent) 15%, transparent)" : "var(--app-card)",
                boxShadow: active ? "0 4px 12px color-mix(in srgb, var(--app-accent) 15%, transparent)" : "none",
              }}
            >
              <span className="relative flex items-center gap-1.5">
                {active && (
                  <span className="text-xs text-[var(--app-accent-2)] animate-pulse" aria-hidden="true">
                    ✦
                  </span>
                )}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}