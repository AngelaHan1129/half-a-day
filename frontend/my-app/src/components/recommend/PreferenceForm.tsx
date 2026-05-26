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
  
  // 共用輸入框基礎樣式類別
  const inputBaseClass =
    "w-full rounded-[16px] border pl-11 pr-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-muted)]";

  const inputFocusStyle = {
    '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)',
  } as React.CSSProperties;

  return (
    <div className="grid gap-5 text-[var(--app-text)]">
      
      {/* 目的地 */}
      <div className="space-y-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <span className="text-[var(--app-accent)]" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </span>
          目的地
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </span>
          <input
            value={form.destination}
            onChange={(e) => onChange("destination", e.target.value)}
            placeholder="例如：小半天、鹿谷"
            className={inputBaseClass}
            style={inputFocusStyle}
          />
        </div>
      </div>

      {/* 偏好描述 */}
      <div className="space-y-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <span className="text-[var(--app-accent)]" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </span>
          偏好描述
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-4 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </span>
          <textarea
            value={form.preferences}
            onChange={(e) => onChange("preferences", e.target.value)}
            rows={4}
            placeholder="例如：想看竹林、喜歡散步、想拍照、希望不要太趕"
            className="w-full rounded-[16px] border pl-11 pr-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-muted)]"
            style={inputFocusStyle}
          />
        </div>
      </div>

      {/* 旅遊風格 */}
      <div className="space-y-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <span className="text-[var(--app-accent)]" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path><line x1="10" y1="22" x2="14" y2="22"></line></svg>
          </span>
          旅遊風格
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 4 5 5"></path><path d="M19 11l-8 8H8v-3l8-8z"></path><path d="M2 22l4-4"></path></svg>
          </span>
          <input
            value={form.travelStyle}
            onChange={(e) => onChange("travelStyle", e.target.value)}
            placeholder="例如：慢遊、深度探索、輕鬆散策"
            className={inputBaseClass}
            style={inputFocusStyle}
          />
        </div>
      </div>

      {/* 預算等級 */}
      <div className="space-y-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <span className="text-[var(--app-accent)]" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="12" x2="12" y2="12"></line><path d="M20 12V8H4v4"></path><path d="M4 16v4h16v-4"></path><circle cx="12" cy="12" r="2"></circle></svg>
          </span>
          預算等級
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] group-focus-within:text-[var(--app-accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="12" y1="12" x2="12" y2="12"></line></svg>
          </span>
          <select
            value={form.budgetLevel}
            onChange={(e) => onChange("budgetLevel", e.target.value)}
            className={`${inputBaseClass} appearance-none cursor-pointer pr-10`}
            style={inputFocusStyle}
          >
            <option value="" disabled>請選擇適合您的預算...</option>
            <option value="low">小資基本（低）</option>
            <option value="medium">標準質感（中）</option>
            <option value="high">豐富體驗（高）</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      {/* 天氣智慧篩選開關 (已修正點擊穿透問題) */}
      <label
        className="group/checkbox flex items-center gap-3 rounded-[16px] border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer select-none hover:bg-[var(--app-surface)]"
        style={{
          boxShadow: "var(--app-shadow)",
        }}
      >
        <div className="relative flex items-center pointer-events-none">
          <input
            type="checkbox"
            checked={form.weatherAware}
            onChange={(e) => onChange("weatherAware", e.target.checked)}
            // 移除了阻擋點擊的 peer-checked 遮罩干擾，改用最穩定的原生點擊響應
            className="h-5 w-5 rounded-[6px] border transition-all pointer-events-auto cursor-pointer"
            style={{
              borderColor: "var(--app-border)",
              backgroundColor: form.weatherAware ? "var(--app-accent)" : "var(--app-surface)",
            }}
          />
          {/* 打勾符號：加入 pointer-events-none 確保滑鼠點擊可以穿透到下層的 input */}
          <svg
            className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-[var(--app-bg)] transition-opacity pointer-events-none ${
              form.weatherAware ? "opacity-100" : "opacity-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <span className="text-sm tracking-wide text-[var(--app-text)] group-hover/checkbox:text-[var(--app-accent)] transition-colors flex items-center gap-2 pointer-events-none">
          <span className="text-[var(--app-muted)] group-hover/checkbox:text-[var(--app-accent)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M4.22 4.22l1.42 1.42M1 12h2M21 12h2M18.36 5.64l1.42-1.42"></path><path d="M22 17a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5 5 5 0 0 1 5-5h1a6.3 6.3 0 0 1 11 0h1a5 5 0 0 1 5 5z"></path></svg>
          </span>
          考慮當前天氣狀況最佳化行程建議
        </span>
      </label>
    </div>
  );
}