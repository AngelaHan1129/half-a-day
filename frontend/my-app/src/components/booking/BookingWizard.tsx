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

  const inputStyle = {
    borderColor: "var(--app-border)",
    background: "var(--app-surface)",
    color: "var(--app-text)",
    boxShadow: "var(--app-shadow)",
  } as const;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] border p-6 transition-colors duration-300 md:p-8"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card)",
        boxShadow: "var(--app-shadow)",
        color: "var(--app-text)",
      }}
    >
      <div
        className="mb-6 flex items-center gap-3 text-sm"
        style={{ color: "var(--app-text-muted)" }}
      >
        <span style={{ color: step >= 1 ? "var(--app-accent)" : "var(--app-text-muted)" }}>
          1. 路線
        </span>
        <span>/</span>
        <span style={{ color: step >= 2 ? "var(--app-accent)" : "var(--app-text-muted)" }}>
          2. 聯絡資料
        </span>
        <span>/</span>
        <span style={{ color: step >= 3 ? "var(--app-accent)" : "var(--app-text-muted)" }}>
          3. 時間與確認
        </span>
      </div>

      <div className="grid gap-6">
        {step === 1 && (
          <>
            <div className="grid gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--app-text)" }}
              >
                選擇路線
              </label>

              <select
                value={form.routeId}
                onChange={(e) => updateField("routeId", e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
                style={inputStyle}
              >
                <option value="">請選擇路線</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            {loadingRoutes && (
              <p style={{ color: "var(--app-text-muted)" }}>載入路線中...</p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--app-text)" }}
              >
                姓名
              </label>

              <input
                value={form.userName}
                onChange={(e) => updateField("userName", e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
                style={inputStyle}
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--app-text)" }}
              >
                Email
              </label>

              <input
                type="email"
                value={form.userEmail}
                onChange={(e) => updateField("userEmail", e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
                style={inputStyle}
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--app-text)" }}
              >
                電話
              </label>

              <input
                value={form.userPhone}
                onChange={(e) => updateField("userPhone", e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <BookingCalendar
              value={form.travelDate}
              onChange={(value) => updateField("travelDate", value)}
            />

            <ParticipantSelector
              value={form.people}
              onChange={(value) => updateField("people", value)}
            />

            <div className="grid gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--app-text)" }}
              >
                備註
              </label>

              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-300"
                style={inputStyle}
              />
            </div>
          </>
        )}

        {error && (
          <p
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: "rgba(244, 63, 94, 0.22)",
              background: "rgba(244, 63, 94, 0.08)",
              color: "#e11d48",
            }}
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-full border px-5 py-3 text-sm font-medium transition-colors duration-300"
              style={{
                borderColor: "var(--app-border)",
                color: "var(--app-text)",
                background: "transparent",
              }}
            >
              上一步
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full px-5 py-3 text-sm font-bold transition-colors duration-300"
              style={{
                background: "var(--app-accent)",
                color: "#ffffff",
              }}
            >
              下一步
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full px-5 py-3 text-sm font-bold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "var(--app-accent)",
                color: "#ffffff",
              }}
            >
              {submitting ? "送出中..." : "送出預約"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}