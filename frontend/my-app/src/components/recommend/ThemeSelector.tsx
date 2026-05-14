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
      <label
        className="text-sm font-semibold"
        style={{ color: "var(--app-text)" }}
      >
        旅遊主題
      </label>

      <div className="flex flex-wrap gap-3">
        {themeOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="rounded-full border px-4 py-2 text-sm transition-colors duration-300"
              style={{
                borderColor: active
                  ? "color-mix(in srgb, var(--app-accent) 28%, transparent)"
                  : "var(--app-border)",
                background: active
                  ? "var(--app-accent)"
                  : "var(--app-card)",
                color: active ? "#ffffff" : "var(--app-text)",
                boxShadow: active ? "var(--app-shadow)" : "none",
                fontWeight: active ? 700 : 500,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}