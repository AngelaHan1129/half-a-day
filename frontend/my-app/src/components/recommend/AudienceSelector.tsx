type AudienceSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const audienceOptions = [
  { label: "自己一人", value: "solo" },
  { label: "情侶甜蜜", value: "couple" },
  { label: "朋友同行", value: "friends" },
  { label: "溫馨家庭", value: "family" },
  { label: "長輩同行", value: "elderly" },
];

export default function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      {/* 套用竹葉按鈕幾何切角的微動畫與形狀 */}
      <style>{`
        .bamboo-leaf-btn {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-btn:hover:not([aria-pressed="true"]) {
          border-radius: 4px 16px 4px 16px;
        }
      `}</style>

      <label className="text-sm font-bold flex items-center gap-2 text-[var(--app-text)]">
        {/* 簡約雙人/同行 Icon SVG */}
        <span className="text-[var(--app-accent)]" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </span>
        同行對象
      </label>

      <div className="flex flex-wrap gap-3">
        {audienceOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`bamboo-leaf-btn px-5 py-2.5 text-sm transition-all duration-300 ${
                active
                  ? "font-bold text-[var(--app-bg)]"
                  : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] hover:text-[var(--app-accent)] hover:border-[var(--app-accent)]"
              }`}
              style={
                active
                  ? {
                      borderColor: "transparent",
                      // 竹林綠與焙茶金的微漸層
                      background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                      boxShadow: "0 6px 16px color-mix(in srgb, var(--app-accent) 35%, transparent)",
                    }
                  : {}
              }
            >
              <span className="relative flex items-center gap-1.5">
                {/* 作用中狀態才顯示的手帳小點綴 */}
                {active && <span className="text-xs">✦</span>}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}