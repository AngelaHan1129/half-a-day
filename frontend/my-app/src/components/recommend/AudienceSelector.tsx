type AudienceSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const audienceOptions = [
  { label: "自己一人", value: "solo" },
  { label: "情侶", value: "couple" },
  { label: "朋友", value: "friends" },
  { label: "家庭", value: "family" },
  { label: "長輩同行", value: "elderly" },
];

export default function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <label
        className="text-sm font-semibold"
        style={{ color: "var(--app-text)" }}
      >
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
              className="rounded-full border px-4 py-2 text-sm transition duration-200"
              style={
                active
                  ? {
                      borderColor: "transparent",
                      background:
                        "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                      color: "#ffffff",
                      fontWeight: 700,
                      boxShadow: "0 10px 24px rgba(99, 102, 241, 0.22)",
                    }
                  : {
                      borderColor: "var(--app-border)",
                      background: "var(--app-card)",
                      color: "var(--app-text-muted)",
                    }
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}