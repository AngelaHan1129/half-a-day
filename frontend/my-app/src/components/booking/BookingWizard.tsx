import BookingCalendar from './BookingCalendar';
import ParticipantSelector from './ParticipantSelector';
import type { Route } from '../../types/route';

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

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8"
    >
      <div className="mb-6 flex items-center gap-3 text-sm text-white/60">
        <span className={step >= 1 ? 'text-lime-300' : ''}>1. 路線</span>
        <span>/</span>
        <span className={step >= 2 ? 'text-lime-300' : ''}>2. 聯絡資料</span>
        <span>/</span>
        <span className={step >= 3 ? 'text-lime-300' : ''}>3. 時間與確認</span>
      </div>

      <div className="grid gap-6">
        {step === 1 && (
          <>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">選擇路線</label>
              <select
                value={form.routeId}
                onChange={(e) => updateField('routeId', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                <option value="">請選擇路線</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            {loadingRoutes && <p className="text-white/60">載入路線中...</p>}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">姓名</label>
              <input
                value={form.userName}
                onChange={(e) => updateField('userName', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">Email</label>
              <input
                type="email"
                value={form.userEmail}
                onChange={(e) => updateField('userEmail', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">電話</label>
              <input
                value={form.userPhone}
                onChange={(e) => updateField('userPhone', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <BookingCalendar
              value={form.travelDate}
              onChange={(value) => updateField('travelDate', value)}
            />

            <ParticipantSelector
              value={form.people}
              onChange={(value) => updateField('people', value)}
            />

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">備註</label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </div>
          </>
        )}

        {error && (
          <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/80"
            >
              上一步
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950"
            >
              下一步
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '送出中...' : '送出預約'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}