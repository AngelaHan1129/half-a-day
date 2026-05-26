type ThemeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const themeOptions = [
  { label: "自然療癒", value: "nature" },
  { label: "美食慢旅", value: "food" },
  { label: "拍照打卡", value: "photo" },
  { label: "文化故事", value: "culture" },
  { label: "親子互動", value: "family" },
];

export default function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      {/* 延續竹林風與手動不規則切角語彙 */}
      <style>{`
        .bamboo-leaf-btn {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-btn:hover:not([aria-pressed="true"]) {
          border-radius: 4px 16px 4px 16px;
        }
      `}</style>

      <label className="text-sm font-bold flex items-center gap-2 text-[var(--app-text)]">
        {/* 日系極簡指南針 Icon SVG */}
        <span className="text-[var(--app-accent)]" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </span>
        旅遊主題
      </label>

      <div className="flex flex-wrap gap-3">
        {themeOptions.map((option) => {
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
                // 作用中狀態：模擬日系手帳印章加蓋的透光層次感
                borderColor: active ? "var(--app-accent)" : "var(--app-border)",
                borderStyle: active ? "dashed" : "solid", // 激活時變虛線紙膠帶邊框
                background: active ? "color-mix(in srgb, var(--app-accent) 15%, transparent)" : "var(--app-card)",
                boxShadow: active ? "0 4px 12px color-mix(in srgb, var(--app-accent) 15%, transparent)" : "none",
              }}
            >
              <span className="relative flex items-center gap-1.5">
                {/* 作用中狀態才閃爍呈現的可愛和風指南針 */}
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