import type { RecommendRequest } from "../../types/recommend";

type PreferenceFormProps = {
  form: RecommendRequest;
  onChange: <K extends keyof RecommendRequest>(
    key: K,
    value: RecommendRequest[K]
  ) => void;
};

export default function PreferenceForm({
  form,
  onChange,
}: PreferenceFormProps) {
  const fieldStyle = {
    borderColor: "var(--app-border)",
    background: "var(--app-card)",
    color: "var(--app-text)",
    boxShadow: "var(--app-shadow)",
  } as const;

  return (
    <div className="grid gap-5" style={{ color: "var(--app-text)" }}>
      <div className="space-y-2">
        <label
          className="text-sm font-semibold"
          style={{ color: "var(--app-text)" }}
        >
          目的地
        </label>
        <input
          value={form.destination}
          onChange={(e) => onChange("destination", e.target.value)}
          placeholder="例如：小半天、鹿谷"
          className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300 placeholder:opacity-100"
          style={fieldStyle}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold"
          style={{ color: "var(--app-text)" }}
        >
          偏好描述
        </label>
        <textarea
          value={form.preferences}
          onChange={(e) => onChange("preferences", e.target.value)}
          rows={4}
          placeholder="例如：想看竹林、喜歡散步、想拍照、希望不要太趕"
          className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300 placeholder:opacity-100"
          style={fieldStyle}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold"
          style={{ color: "var(--app-text)" }}
        >
          旅遊風格
        </label>
        <input
          value={form.travelStyle}
          onChange={(e) => onChange("travelStyle", e.target.value)}
          placeholder="例如：慢遊、深度探索、輕鬆散策"
          className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300 placeholder:opacity-100"
          style={fieldStyle}
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-semibold"
          style={{ color: "var(--app-text)" }}
        >
          預算等級
        </label>
        <select
          value={form.budgetLevel}
          onChange={(e) => onChange("budgetLevel", e.target.value)}
          className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
          style={fieldStyle}
        >
          <option value="">請選擇預算</option>
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>

      <label
        className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-card)",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <input
          type="checkbox"
          checked={form.weatherAware}
          onChange={(e) => onChange("weatherAware", e.target.checked)}
          style={{
            accentColor: "var(--app-accent)",
          }}
        />
        考慮天氣條件做推薦
      </label>
    </div>
  );
}