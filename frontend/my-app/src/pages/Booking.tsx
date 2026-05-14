import { useEffect, useState } from "react";
import BookingSuccessCard from "../components/booking/BookingSuccessCard";
import BookingSummary from "../components/booking/BookingSummary";
import BookingWizard from "../components/booking/BookingWizard";
import { bookingApi } from "../services/api/bookingApi";
import { routeApi } from "../services/api/routesApi";
import type { Booking, BookingCreateRequest } from "../types/booking";
import type { Route } from "../types/route";

type BookingFormState = {
  routeId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  people: number;
  notes: string;
};

const initialForm: BookingFormState = {
  routeId: "",
  userName: "",
  userEmail: "",
  userPhone: "",
  travelDate: "",
  people: 1,
  notes: "",
};

export default function Booking() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormState>(initialForm);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoadingRoutes(true);
        setError("");
        const data = await routeApi.getAll();
        setRoutes(data);
      } catch (err) {
        console.error(err);
        setError("載入路線失敗");
      } finally {
        setLoadingRoutes(false);
      }
    };

    loadRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.routeId) {
      setError("請選擇路線");
      setStep(1);
      return;
    }

    if (!form.userName || !form.userEmail) {
      setError("請完整填寫聯絡資料");
      setStep(2);
      return;
    }

    if (!form.travelDate) {
      setError("請選擇出發時間");
      setStep(3);
      return;
    }

    const payload: BookingCreateRequest = {
      route: { id: Number(form.routeId) },
      userName: form.userName,
      userEmail: form.userEmail,
      userPhone: form.userPhone || null,
      travelDate: new Date(form.travelDate).toISOString(),
      people: form.people,
      notes: form.notes || null,
    };

    try {
      setSubmitting(true);
      const created = await bookingApi.create(payload);
      setResult(created);
      setForm(initialForm);
      setStep(1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "建立預約失敗");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setForm(initialForm);
    setStep(1);
  };

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <section
        className="border-b transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background:
            "radial-gradient(circle at top, color-mix(in srgb, var(--app-accent) 14%, transparent) 0%, transparent 34%), linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 90%, #111827 10%) 0%, var(--app-bg) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <p
            className="text-sm uppercase tracking-[0.24em]"
            style={{ color: "var(--app-accent)" }}
          >
            Smart Booking
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            線上預約
          </h1>

          <p
            className="mt-5 max-w-3xl text-base leading-8"
            style={{ color: "var(--app-text-muted)" }}
          >
            使用多步驟方式完成路線選擇、聯絡資訊與出發時間設定，最後送出預約。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {result ? (
            <BookingSuccessCard booking={result} onReset={handleReset} />
          ) : (
            <BookingWizard
              step={step}
              setStep={setStep}
              form={form}
              setForm={setForm}
              routes={routes}
              loadingRoutes={loadingRoutes}
              submitting={submitting}
              error={error}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <BookingSummary
          routes={routes}
          routeId={form.routeId}
          userName={form.userName}
          userEmail={form.userEmail}
          userPhone={form.userPhone}
          travelDate={form.travelDate}
          people={form.people}
          notes={form.notes}
        />
      </section>
    </main>
  );
}