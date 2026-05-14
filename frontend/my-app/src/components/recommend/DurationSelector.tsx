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
      <label
        className="text-sm font-semibold"
        style={{ color: "var(--app-text)" }}
      >
        可安排時數
      </label>

      <div className="flex flex-wrap gap-3">
        {durationOptions.map((option) => {
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