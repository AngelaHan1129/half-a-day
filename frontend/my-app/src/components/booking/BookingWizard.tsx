import BookingCalendar from "./BookingCalendar";
import ParticipantSelector from "./ParticipantSelector";
import type { Route } from "../../types/route";

type BookingFormState = {
  routeId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  people: number;
  notes: string;
};

type BookingWizardProps = {
  step: number;
  setStep: (step: number) => void;
  form: BookingFormState;
  setForm: React.Dispatch<React.SetStateAction<BookingFormState>>;
  routes: Route[];
  loadingRoutes: boolean;
  submitting: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
};

export default function BookingWizard({
  step,
  setStep,
  form,
  setForm,
  routes,
  loadingRoutes,
  submitting,
  error,
  onSubmit,
}: BookingWizardProps) {
  const updateField = <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(Math.min(step + 1, 3));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  // 共用的輸入框樣式
  const inputBaseClass =
    "w-full rounded-[16px] border px-4 py-3 outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)]";
  
  const inputFocusStyle = {
    '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)',
  } as React.CSSProperties;

  return (
    <form
      onSubmit={onSubmit}
      className="group/wizard hand-drawn-border relative overflow-hidden border-2 p-6 transition-all duration-500 md:p-8 bg-[var(--app-card)] shadow-lg hover:shadow-xl"
      style={{
        borderColor: "var(--app-border)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <style>{`
        .hand-drawn-border {
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .bamboo-leaf-shape {
          border-radius: 20px 4px 20px 4px;
        }
        .bamboo-leaf-shape:hover {
          border-radius: 4px 20px 4px 20px;
        }
        @keyframes step-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes bamboo-breeze {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(2deg) skewX(-2deg); }
        }
      `}</style>

      {/* 手繪塗鴉風：背景浮水印小圖案 */}
      <div className="absolute -right-4 -top-4 opacity-[0.03] text-[var(--app-accent)] pointer-events-none">
        <svg className="h-32 w-32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
        </svg>
      </div>

      {/* 視覺化進度條 (Stepper) */}
      <div className="relative mb-8 flex items-center justify-between px-2">
        {/* 背景虛線連線 */}
        <div 
          className="absolute left-0 top-1/2 -z-10 h-[2px] w-full -translate-y-1/2 border-t-2 border-dashed transition-colors duration-500"
          style={{ borderColor: "var(--app-border)" }}
        />
        
        {[
          { num: 1, label: "路線選擇" },
          { num: 2, label: "聯絡資料" },
          { num: 3, label: "時間確認" },
        ].map((item) => {
          const isActive = step === item.num;
          const isPassed = step > item.num;
          return (
            <div key={item.num} className="relative flex flex-col items-center gap-2 bg-[var(--app-card)] px-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-500 ${
                  isActive
                    ? "animate-[step-bounce_2s_ease-in-out_infinite] border-[var(--app-accent)] bg-[var(--app-accent)] text-[var(--app-bg)] shadow-[0_0_16px_color-mix(in_srgb,var(--app-accent)_40%,transparent)]"
                    : isPassed
                    ? "border-[var(--app-accent)] bg-[var(--app-surface)] text-[var(--app-accent)]"
                    : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]"
                }`}
              >
                {isPassed ? "✓" : item.num}
              </div>
              <span 
                className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-[var(--app-accent)]" : "text-[var(--app-muted)]"
                }`}
              >
                {item.label}
              </span>
              
              {/* 當前步驟的裝飾小星星 */}
              {isActive && (
                <span className="absolute -top-1 -right-2 text-sm text-[var(--app-accent)] opacity-80" aria-hidden="true">
                  ✦
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 grid gap-6">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid gap-2">
              <label className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <span className="text-[var(--app-accent)]">01.</span> 選擇小半天路線
              </label>

              <div className="relative">
                <select
                  value={form.routeId}
                  onChange={(e) => updateField("routeId", e.target.value)}
                  className={`${inputBaseClass} appearance-none cursor-pointer`}
                  style={inputFocusStyle}
                >
                  <option value="" disabled>請展開選擇想要探索的路線...</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
                {/* 自訂下拉箭頭 SVG */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {loadingRoutes && (
              <p className="mt-2 text-sm text-[var(--app-text-muted)] animate-pulse flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
                載入路線中...
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid gap-2">
              <label className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <span className="text-[var(--app-accent)]">02.</span> 預約代表姓名
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input
                  value={form.userName}
                  onChange={(e) => updateField("userName", e.target.value)}
                  placeholder="請輸入真實姓名"
                  className={`${inputBaseClass} pl-11`}
                  style={inputFocusStyle}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <span className="text-[var(--app-accent)]">03.</span> 聯絡信箱 Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </span>
                <input
                  type="email"
                  value={form.userEmail}
                  onChange={(e) => updateField("userEmail", e.target.value)}
                  placeholder="example@mail.com"
                  className={`${inputBaseClass} pl-11`}
                  style={inputFocusStyle}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <span className="text-[var(--app-accent)]">04.</span> 聯絡電話
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </span>
                <input
                  value={form.userPhone}
                  onChange={(e) => updateField("userPhone", e.target.value)}
                  placeholder="09xx-xxx-xxx"
                  className={`${inputBaseClass} pl-11`}
                  style={inputFocusStyle}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="text-sm font-bold text-[var(--app-text)] mb-2 flex items-center gap-2">
                <span className="text-[var(--app-accent)]">05.</span> 出發日期與人數
              </label>
              <div className="rounded-[20px] border border-[var(--app-border)] p-4 bg-[var(--app-surface)]">
                <BookingCalendar
                  value={form.travelDate}
                  onChange={(value) => updateField("travelDate", value)}
                />
                <div className="mt-4 border-t border-[var(--app-border)] pt-4">
                  <ParticipantSelector
                    value={form.people}
                    onChange={(value) => updateField("people", value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold text-[var(--app-text)] flex items-center gap-2">
                <span className="text-[var(--app-accent)]">06.</span> 其他備註事項
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="例如：有素食需求、長輩同行等..."
                className={inputBaseClass}
                style={inputFocusStyle}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            className="rounded-[16px] border px-4 py-3 text-sm flex items-center gap-2 animate-in slide-in-from-bottom-2"
            style={{
              borderColor: "color-mix(in srgb, #e11d48 30%, transparent)",
              backgroundColor: "color-mix(in srgb, #e11d48 8%, var(--app-surface))",
              color: "#e11d48",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {/* 底部導覽按鈕 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--app-border)]">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-x-1"
              style={{
                color: "var(--app-text-muted)",
                backgroundColor: "color-mix(in srgb, var(--app-border) 40%, transparent)",
              }}
            >
              ← 上一步
            </button>
          ) : (
            <div></div> // 佔位，讓下一步按鈕靠右
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bamboo-leaf-shape px-6 py-3 text-sm font-bold transition-all duration-300 hover:animate-[bamboo-breeze_4s_ease-in-out_infinite]"
              style={{
                backgroundColor: "var(--app-accent)",
                color: "var(--app-bg)",
                boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 40%, transparent)",
              }}
            >
              下一步 →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="bamboo-leaf-shape px-8 py-3 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:animate-[bamboo-breeze_4s_ease-in-out_infinite]"
              style={{
                backgroundColor: "var(--app-accent)",
                color: "var(--app-bg)",
                boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 40%, transparent)",
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-bg)] border-t-transparent"></span>
                  處理中...
                </span>
              ) : (
                "確認送出預約 ✦"
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}